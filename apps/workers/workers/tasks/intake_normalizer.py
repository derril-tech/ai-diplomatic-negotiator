from celery import shared_task
from typing import Dict, Any, List
import structlog

logger = structlog.get_logger()

@shared_task
def normalize_intake(negotiation_data: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize intake data for negotiation processing"""
    logger.info("Starting intake normalization", negotiation_id=negotiation_data.get('id'))
    
    try:
        # Validate required fields
        required_fields = ['title', 'parties', 'issues']
        for field in required_fields:
            if field not in negotiation_data:
                raise ValueError(f"Missing required field: {field}")
        
        # Normalize parties
        normalized_parties = _normalize_parties(negotiation_data.get('parties', []))
        
        # Normalize issues
        normalized_issues = _normalize_issues(negotiation_data.get('issues', []))
        
        # Normalize preferences
        normalized_preferences = _normalize_preferences(
            negotiation_data.get('preferences', {}),
            normalized_parties,
            normalized_issues
        )
        
        # Validate ZOPA potential
        zopa_analysis = _analyze_zopa_potential(normalized_preferences)
        
        result = {
            "status": "normalized",
            "data": {
                "negotiation": {
                    "title": negotiation_data['title'],
                    "description": negotiation_data.get('description', ''),
                    "metadata": negotiation_data.get('metadata', {}),
                    "settings": negotiation_data.get('settings', {
                        "allowSideConversations": True,
                        "requireApproval": True,
                        "autoAdvance": False,
                        "timeLimitPerRound": 30
                    })
                },
                "parties": normalized_parties,
                "issues": normalized_issues,
                "preferences": normalized_preferences,
                "zopa_analysis": zopa_analysis
            }
        }
        
        logger.info("Intake normalization completed", 
                   negotiation_id=negotiation_data.get('id'),
                   parties_count=len(normalized_parties),
                   issues_count=len(normalized_issues))
        
        return result
        
    except Exception as e:
        logger.error("Intake normalization failed", 
                    negotiation_id=negotiation_data.get('id'),
                    error=str(e))
        return {
            "status": "failed",
            "error": str(e),
            "data": negotiation_data
        }

def _normalize_parties(parties: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Normalize party data"""
    normalized = []
    
    for i, party in enumerate(parties):
        normalized_party = {
            "id": party.get('id', f"party_{i}"),
            "name": party.get('name', f"Party {i+1}"),
            "type": party.get('type', 'organization'),
            "country": party.get('country'),
            "organization": party.get('organization'),
            "website": party.get('website'),
            "metadata": party.get('metadata', {}),
            "isActive": party.get('isActive', True)
        }
        normalized.append(normalized_party)
    
    return normalized

def _normalize_issues(issues: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Normalize issue data"""
    normalized = []
    
    for i, issue in enumerate(issues):
        normalized_issue = {
            "id": issue.get('id', f"issue_{i}"),
            "title": issue.get('title', f"Issue {i+1}"),
            "description": issue.get('description', ''),
            "type": issue.get('type', 'distributive'),
            "weight": float(issue.get('weight', 0)),
            "minValue": float(issue.get('minValue', 0)),
            "maxValue": float(issue.get('maxValue', 100)),
            "unit": issue.get('unit'),
            "constraints": issue.get('constraints', {
                "redLines": [],
                "mustHaves": [],
                "niceToHaves": []
            }),
            "metadata": issue.get('metadata', {}),
            "isActive": issue.get('isActive', True)
        }
        normalized.append(normalized_issue)
    
    return normalized

def _normalize_preferences(preferences: Dict[str, Any], 
                          parties: List[Dict[str, Any]], 
                          issues: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Normalize party issue preferences"""
    normalized = []
    
    for party in parties:
        party_id = party['id']
        party_prefs = preferences.get(party_id, {})
        
        for issue in issues:
            issue_id = issue['id']
            issue_prefs = party_prefs.get(issue_id, {})
            
            normalized_pref = {
                "partyId": party_id,
                "issueId": issue_id,
                "weight": float(issue_prefs.get('weight', 0)),
                "reservationValue": float(issue_prefs.get('reservationValue', issue['minValue'])),
                "targetValue": float(issue_prefs.get('targetValue', issue['maxValue'])),
                "utilityCurve": issue_prefs.get('utilityCurve', {
                    "type": "linear",
                    "parameters": {}
                }),
                "constraints": issue_prefs.get('constraints', {
                    "redLines": [],
                    "mustHaves": [],
                    "niceToHaves": [],
                    "batna": ""
                }),
                "metadata": issue_prefs.get('metadata', {})
            }
            normalized.append(normalized_pref)
    
    return normalized

def _analyze_zopa_potential(preferences: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Analyze Zone of Possible Agreement potential"""
    issue_analysis = {}
    
    # Group preferences by issue
    issue_prefs = {}
    for pref in preferences:
        issue_id = pref['issueId']
        if issue_id not in issue_prefs:
            issue_prefs[issue_id] = []
        issue_prefs[issue_id].append(pref)
    
    # Analyze each issue for ZOPA
    for issue_id, prefs in issue_prefs.items():
        reservation_values = [p['reservationValue'] for p in prefs]
        target_values = [p['targetValue'] for p in prefs]
        
        min_reservation = min(reservation_values)
        max_reservation = max(reservation_values)
        min_target = min(target_values)
        max_target = max(target_values)
        
        # ZOPA exists if there's overlap between reservation values
        zopa_exists = min_reservation <= max_reservation
        
        issue_analysis[issue_id] = {
            "zopa_exists": zopa_exists,
            "reservation_range": [min_reservation, max_reservation],
            "target_range": [min_target, max_target],
            "overlap_size": max(0, max_reservation - min_reservation) if zopa_exists else 0,
            "parties_count": len(prefs)
        }
    
    # Overall ZOPA assessment
    issues_with_zopa = sum(1 for analysis in issue_analysis.values() if analysis['zopa_exists'])
    total_issues = len(issue_analysis)
    
    return {
        "overall_zopa_exists": issues_with_zopa > 0,
        "zopa_coverage": issues_with_zopa / total_issues if total_issues > 0 else 0,
        "issues_with_zopa": issues_with_zopa,
        "total_issues": total_issues,
        "issue_analysis": issue_analysis
    }
