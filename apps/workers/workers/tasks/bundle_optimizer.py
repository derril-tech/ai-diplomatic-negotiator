from celery import shared_task
from typing import Dict, Any, List, Tuple
import structlog
import math

logger = structlog.get_logger()

@shared_task
def optimize_bundles(issues: List[Dict[str, Any]], utilities: Dict[str, Dict[str, float]], method: str = 'nash', max_points: int = 500) -> Dict[str, Any]:
    """Optimize bundles across issues to compute Pareto frontier and recommend bundles.

    issues: [{ id, title, minValue, maxValue }]
    utilities: { party_id: { issue_id:value_utility_weighted } } or per-issue utilities
    method: 'nash' | 'kalai' | 'wsw' (weighted social welfare)
    """
    logger.info("Starting bundle optimization", method=method, issues=len(issues))

    try:
        # Discretize space (coarse grid for MVP)
        grid_resolution = 11  # 0..10
        grids: List[List[float]] = []
        for issue in issues:
            lo = float(issue.get('minValue', 0))
            hi = float(issue.get('maxValue', 100))
            step = (hi - lo) / (grid_resolution - 1)
            grids.append([lo + step * i for i in range(grid_resolution)])

        # Generate combinations (guard explosion by capping)
        combos: List[Tuple[float, ...]] = []
        def backtrack(idx: int, acc: List[float]):
            nonlocal combos
            if len(combos) >= 5000:  # hard cap
                return
            if idx == len(grids):
                combos.append(tuple(acc))
                return
            for v in grids[idx]:
                acc.append(v)
                backtrack(idx + 1, acc)
                acc.pop()
        backtrack(0, [])

        party_ids = list(utilities.keys())
        issue_ids = [issue['id'] for issue in issues]

        def compute_party_utility(party_id: str, values: Dict[str, float]) -> float:
            # Expect utilities[party_id][issue_id] to be a weight factor [0..1] and we map value to 0..1 by issue range
            total = 0.0
            weight_sum = 0.0
            for issue in issues:
                iid = issue['id']
                lo = float(issue.get('minValue', 0))
                hi = float(issue.get('maxValue', 100))
                w = float(utilities.get(party_id, {}).get(iid, 0.0))
                if hi > lo:
                    normalized = (values[iid] - lo) / (hi - lo)
                else:
                    normalized = 0.0
                total += w * normalized
                weight_sum += max(w, 0.0)
            return total / weight_sum if weight_sum > 0 else 0.0

        # Evaluate combinations
        evaluated = []
        for combo in combos:
            values = { issue_ids[i]: combo[i] for i in range(len(issue_ids)) }
            party_utils = { pid: compute_party_utility(pid, values) for pid in party_ids }
            # Aggregate per method
            if method == 'nash':
                # Nash product
                agg = 1.0
                for pid in party_ids:
                    agg *= max(party_utils[pid], 1e-6)
            elif method == 'kalai':
                # Equal proportional gains: approx by minimizing variance around mean
                mean_u = sum(party_utils.values()) / max(1, len(party_utils))
                agg = -sum((u - mean_u) ** 2 for u in party_utils.values())
            else:  # wsw
                agg = sum(party_utils.values())
            evaluated.append({
                'values': values,
                'party_utils': party_utils,
                'score': agg
            })

        # Compute Pareto frontier
        def dominates(a, b):
            better_or_equal_all = True
            strictly_better = False
            for pid in party_ids:
                if a['party_utils'][pid] < b['party_utils'][pid]:
                    better_or_equal_all = False
                    break
                if a['party_utils'][pid] > b['party_utils'][pid]:
                    strictly_better = True
            return better_or_equal_all and strictly_better

        pareto = []
        for i, a in enumerate(evaluated):
            if any(dominates(b, a) for b in evaluated if b is not a):
                continue
            pareto.append(a)

        # Sort frontier by sum utility desc and cap
        pareto.sort(key=lambda x: sum(x['party_utils'].values()), reverse=True)
        if len(pareto) > max_points:
            step = max(1, len(pareto) // max_points)
            pareto = pareto[::step][:max_points]

        # Best recommendation by chosen method
        best = max(evaluated, key=lambda x: x['score']) if evaluated else None

        result = {
            'status': 'success',
            'method': method,
            'pareto': pareto,
            'best': best,
            'party_ids': party_ids,
            'issue_ids': issue_ids,
            'frontier_size': len(pareto)
        }
        logger.info("Bundle optimization completed", frontier_size=len(pareto))
        return result
    except Exception as e:
        logger.error("Bundle optimization failed", error=str(e))
        return { 'status': 'failed', 'error': str(e) }
