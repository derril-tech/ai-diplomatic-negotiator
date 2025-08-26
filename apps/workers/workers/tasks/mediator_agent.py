from celery import shared_task
from typing import Dict, Any, List
import structlog

logger = structlog.get_logger()

@shared_task
def consolidate_final_package(
    negotiation: Dict[str, Any],
    parties: List[Dict[str, Any]],
    issues: List[Dict[str, Any]],
    positions: Dict[str, Any],
    offers: List[Dict[str, Any]],
    optimization: Dict[str, Any],
    risk: Dict[str, Any]
) -> Dict[str, Any]:
    """Consolidate final package draft combining positions, selected offers, optimization insights, and risk notes."""
    logger.info("Consolidating final package", negotiation_id=negotiation.get('id'))
    try:
        # Select recommended bundle from optimization (best)
        recommended = optimization.get('best') or {}
        recommended_values = recommended.get('values', {})

        # Map offers per issue (prefer ones aligning with recommended values when possible)
        selected_offers = []
        for issue in issues:
            iid = issue['id']
            # choose offer closest to recommended value
            candidates = [o for o in offers if o.get('issue_id') == iid]
            if not candidates:
                continue
            target = recommended_values.get(iid)
            if target is None:
                selected = max(candidates, key=lambda o: o.get('confidence', 0))
            else:
                selected = min(candidates, key=lambda o: abs(float(o.get('proposed_value', 0)) - float(target)))
            selected_offers.append(selected)

        # Risk notes
        risk_notes = []
        for item in risk.get('issues', []):
            if abs(item.get('expected_impact', 0.0)) >= 0.15:
                risk_notes.append({
                    'issue_id': item['issue_id'],
                    'note': 'High expected risk impact',
                    'expected_impact': item['expected_impact']
                })

        package = {
            'status': 'draft',
            'negotiation_id': negotiation.get('id'),
            'title': f"Final Package: {negotiation.get('title', 'Negotiation')}",
            'summary': {
                'parties': [p.get('name') for p in parties],
                'issues': [i.get('title') for i in issues],
                'recommendation_basis': optimization.get('method', 'nash'),
            },
            'positions': positions,
            'selected_offers': selected_offers,
            'recommended_values': recommended_values,
            'pareto_frontier_size': optimization.get('frontier_size'),
            'risk_notes': risk_notes,
            'approvals_required': [
                {'role': 'mediator', 'status': 'pending'},
                {'role': 'delegate', 'status': 'pending'},
                {'role': 'analyst', 'status': 'pending'}
            ]
        }
        logger.info("Consolidation complete", negotiation_id=negotiation.get('id'))
        return { 'status': 'success', 'package': package }
    except Exception as e:
        logger.error("Consolidation failed", error=str(e))
        return { 'status': 'failed', 'error': str(e) }
