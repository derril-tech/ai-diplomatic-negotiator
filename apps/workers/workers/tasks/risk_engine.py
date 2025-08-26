from celery import shared_task
from typing import Dict, Any, List
import structlog

logger = structlog.get_logger()

@shared_task
def build_risk_tree(issues: List[Dict[str, Any]], scenarios: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Build risk tree and compute expected outcomes per issue.

    issues: [{ id, title }]
    scenarios: [
      {
        "name": "baseline|optimistic|adverse|custom",
        "probability": 0.4,
        "impacts": { issue_id: impact_on_utility in [-1,1] }
      }
    ]
    Returns expected utilities adjustments and per-scenario impacts.
    """
    logger.info("Building risk tree", issues=len(issues), scenarios=len(scenarios))
    try:
        # Normalize probabilities
        total_p = sum(max(0.0, float(s.get('probability', 0.0))) for s in scenarios) or 1.0
        normalized = []
        for s in scenarios:
            p = max(0.0, float(s.get('probability', 0.0))) / total_p
            normalized.append({ **s, 'probability': p })

        # Expected impact per issue
        results = []
        for issue in issues:
            iid = issue['id']
            exp_impact = 0.0
            per_scenario = []
            for s in normalized:
                impact = float(s.get('impacts', {}).get(iid, 0.0))
                p = float(s['probability'])
                exp_impact += p * impact
                per_scenario.append({ 'scenario': s.get('name', 'scenario'), 'probability': p, 'impact': impact })
            results.append({
                'issue_id': iid,
                'expected_impact': exp_impact,
                'scenarios': per_scenario
            })

        overall_risk_index = sum(abs(r['expected_impact']) for r in results) / max(1, len(results))
        return { 'status': 'success', 'issues': results, 'overall_risk_index': overall_risk_index }
    except Exception as e:
        logger.error("Risk tree build failed", error=str(e))
        return { 'status': 'failed', 'error': str(e) }
