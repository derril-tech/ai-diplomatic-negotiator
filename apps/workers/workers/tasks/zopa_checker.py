from celery import shared_task
from typing import Dict, Any, List
import structlog

logger = structlog.get_logger()

@shared_task
def check_zopa(issues: List[Dict[str, Any]], reservations: Dict[str, Dict[str, float]], targets: Dict[str, Dict[str, float]]) -> Dict[str, Any]:
    """Check ZOPA intervals per issue across all parties.

    issues: [{ id, minValue, maxValue }]
    reservations: { party_id: { issue_id: reservation_value } }
    targets: { party_id: { issue_id: target_value } }
    Returns per-issue ZOPA intervals if exist: intersection of acceptable ranges.
    """
    logger.info("Checking ZOPA", issues=len(issues))
    try:
        issue_results = []
        for issue in issues:
            iid = issue['id']
            party_ranges = []
            for party_id in reservations.keys():
                r = float(reservations.get(party_id, {}).get(iid, issue.get('minValue', 0)))
                t = float(targets.get(party_id, {}).get(iid, issue.get('maxValue', 100)))
                lo, hi = (min(r, t), max(r, t))
                party_ranges.append((lo, hi))

            if not party_ranges:
                issue_results.append({ 'issue_id': iid, 'has_zopa': False, 'interval': None })
                continue

            # Intersection across parties
            zopa_lo = max(lo for lo, _ in party_ranges)
            zopa_hi = min(hi for _, hi in party_ranges)
            has_zopa = zopa_lo <= zopa_hi

            issue_results.append({
                'issue_id': iid,
                'has_zopa': has_zopa,
                'interval': [zopa_lo, zopa_hi] if has_zopa else None,
                'party_ranges': party_ranges
            })

        overall = all(item['has_zopa'] for item in issue_results) if issue_results else False
        return { 'status': 'success', 'issues': issue_results, 'all_issues_have_zopa': overall }
    except Exception as e:
        logger.error("ZOPA check failed", error=str(e))
        return { 'status': 'failed', 'error': str(e) }
