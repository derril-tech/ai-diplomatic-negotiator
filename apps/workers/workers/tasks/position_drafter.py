from celery import shared_task
from typing import Dict, Any, List
import structlog

logger = structlog.get_logger()

@shared_task
def draft_position(party_data: Dict[str, Any], issue_data: Dict[str, Any], 
                  preference_data: Dict[str, Any], position_type: str = 'public') -> Dict[str, Any]:
    """Draft position brief for a party on a specific issue"""
    logger.info("Starting position drafting", 
               party_id=party_data.get('id'),
               issue_id=issue_data.get('id'),
               position_type=position_type)
    
    try:
        # Extract key information
        party_name = party_data.get('name', 'Unknown Party')
        party_type = party_data.get('type', 'organization')
        party_country = party_data.get('country')
        party_org = party_data.get('organization')
        
        issue_title = issue_data.get('title', 'Unknown Issue')
        issue_description = issue_data.get('description', '')
        issue_type = issue_data.get('type', 'distributive')
        
        weight = preference_data.get('weight', 0)
        reservation_value = preference_data.get('reservationValue', 0)
        target_value = preference_data.get('targetValue', 100)
        batna = preference_data.get('batna', '')
        
        # Generate position based on type
        if position_type == 'public':
            position = _generate_public_position(
                party_name, party_type, party_country, party_org,
                issue_title, issue_description, issue_type,
                weight, reservation_value, target_value, batna
            )
        else:  # private
            position = _generate_private_position(
                party_name, party_type, party_country, party_org,
                issue_title, issue_description, issue_type,
                weight, reservation_value, target_value, batna
            )
        
        result = {
            "status": "completed",
            "position_type": position_type,
            "party_id": party_data.get('id'),
            "issue_id": issue_data.get('id'),
            "position": position
        }
        
        logger.info("Position drafting completed", 
                   party_id=party_data.get('id'),
                   issue_id=issue_data.get('id'))
        
        return result
        
    except Exception as e:
        logger.error("Position drafting failed", 
                    party_id=party_data.get('id'),
                    issue_id=issue_data.get('id'),
                    error=str(e))
        return {
            "status": "failed",
            "error": str(e),
            "party_id": party_data.get('id'),
            "issue_id": issue_data.get('id')
        }

def _generate_public_position(party_name: str, party_type: str, party_country: str, party_org: str,
                            issue_title: str, issue_description: str, issue_type: str,
                            weight: float, reservation_value: float, target_value: float, batna: str) -> Dict[str, Any]:
    """Generate public position statement"""
    
    # Determine stance based on issue type and preferences
    if issue_type == 'distributive':
        if weight > 50:
            stance = f"{party_name} considers {issue_title} a critical priority and will advocate strongly for favorable terms."
        elif weight > 25:
            stance = f"{party_name} views {issue_title} as important and seeks reasonable compromise."
        else:
            stance = f"{party_name} is open to discussion on {issue_title} but has limited flexibility."
    elif issue_type == 'integrative':
        stance = f"{party_name} believes {issue_title} presents opportunities for mutual gain and creative solutions."
    else:  # linked
        stance = f"{party_name} recognizes the interconnected nature of {issue_title} and seeks comprehensive solutions."
    
    # Generate arguments based on party characteristics
    arguments = []
    
    if party_country:
        arguments.append(f"National interests and economic impact on {party_country}")
    
    if party_org:
        arguments.append(f"Organizational mandate and stakeholder obligations")
    
    if weight > 50:
        arguments.append("High strategic importance and long-term implications")
    
    if issue_type == 'integrative':
        arguments.append("Potential for value creation and expanded opportunities")
    
    # Generate evidence points
    evidence = []
    if weight > 30:
        evidence.append("Economic analysis and impact assessments")
        evidence.append("Stakeholder consultations and feedback")
    
    if party_country:
        evidence.append("International precedents and best practices")
    
    if issue_type == 'linked':
        evidence.append("Cross-sectoral impact analysis")
    
    return {
        "stance": stance,
        "interests": {
            "primary": f"Secure favorable terms on {issue_title}",
            "secondary": "Maintain relationships and reputation",
            "constraints": "Must meet minimum acceptable outcomes"
        },
        "arguments": arguments,
        "evidence": evidence,
        "negotiation_approach": _determine_negotiation_approach(weight, issue_type),
        "flexibility_level": _determine_flexibility_level(weight, reservation_value, target_value)
    }

def _generate_private_position(party_name: str, party_type: str, party_country: str, party_org: str,
                             issue_title: str, issue_description: str, issue_type: str,
                             weight: float, reservation_value: float, target_value: float, batna: str) -> Dict[str, Any]:
    """Generate private/internal position brief"""
    
    # More candid assessment
    if weight > 70:
        priority_level = "Critical"
        flexibility = "Very Limited"
        strategy = "Strong advocacy with minimal concessions"
    elif weight > 40:
        priority_level = "High"
        flexibility = "Moderate"
        strategy = "Balanced approach with selective concessions"
    else:
        priority_level = "Medium"
        flexibility = "High"
        strategy = "Cooperative approach with willingness to compromise"
    
    # Internal interests
    internal_interests = {
        "core_objectives": [
            f"Achieve target value of {target_value} on {issue_title}",
            "Maintain minimum acceptable outcome of {reservation_value}",
            "Preserve relationships and future negotiation capital"
        ],
        "risk_factors": [
            "Public perception and political implications",
            "Economic impact and stakeholder reactions",
            "Precedent setting for future negotiations"
        ],
        "opportunities": [
            "Potential for integrative solutions" if issue_type == 'integrative' else "Limited integrative potential",
            "Relationship building with other parties",
            "Knowledge sharing and capacity building"
        ]
    }
    
    # BATNA analysis
    batna_analysis = {
        "strength": _assess_batna_strength(batna),
        "implications": _analyze_batna_implications(batna, weight),
        "fallback_plan": _generate_fallback_plan(batna, reservation_value)
    }
    
    # Negotiation strategy
    strategy_details = {
        "opening_position": f"Start with target value of {target_value}",
        "concession_strategy": _determine_concession_strategy(weight, issue_type),
        "deal_breakers": [f"Outcomes below {reservation_value}"],
        "success_metrics": [
            f"Achieve outcome above {target_value}",
            "Maintain positive relationships",
            "Set favorable precedents"
        ]
    }
    
    return {
        "priority_level": priority_level,
        "flexibility": flexibility,
        "strategy": strategy,
        "internal_interests": internal_interests,
        "batna_analysis": batna_analysis,
        "strategy_details": strategy_details,
        "confidential_notes": _generate_confidential_notes(party_name, issue_title, weight, batna)
    }

def _determine_negotiation_approach(weight: float, issue_type: str) -> str:
    """Determine negotiation approach based on weight and issue type"""
    if weight > 60:
        return "Competitive - Strong advocacy for favorable terms"
    elif weight > 30:
        return "Mixed - Balance between advocacy and cooperation"
    else:
        return "Cooperative - Focus on relationship building and mutual gains"

def _determine_flexibility_level(weight: float, reservation_value: float, target_value: float) -> str:
    """Determine flexibility level"""
    range_size = target_value - reservation_value
    if weight > 50 and range_size < 20:
        return "Low - Limited room for compromise"
    elif weight > 30 and range_size < 40:
        return "Moderate - Some flexibility within constraints"
    else:
        return "High - Significant room for compromise"

def _assess_batna_strength(batna: str) -> str:
    """Assess BATNA strength"""
    if not batna or len(batna.strip()) < 20:
        return "Weak - Limited alternatives"
    elif len(batna) < 100:
        return "Moderate - Some alternatives available"
    else:
        return "Strong - Credible alternatives exist"

def _analyze_batna_implications(batna: str, weight: float) -> List[str]:
    """Analyze BATNA implications"""
    implications = []
    
    if not batna or len(batna.strip()) < 20:
        implications.append("Limited leverage in negotiations")
        implications.append("May need to make concessions to reach agreement")
    else:
        implications.append("Provides leverage and negotiation power")
        implications.append("Can walk away if terms are unfavorable")
    
    if weight > 50:
        implications.append("High priority issue - BATNA strength critical")
    
    return implications

def _generate_fallback_plan(batna: str, reservation_value: float) -> str:
    """Generate fallback plan"""
    if not batna or len(batna.strip()) < 20:
        return f"Focus on achieving minimum acceptable outcome of {reservation_value}"
    else:
        return f"Implement BATNA if unable to achieve outcomes above {reservation_value}"

def _determine_concession_strategy(weight: float, issue_type: str) -> str:
    """Determine concession strategy"""
    if weight > 60:
        return "Minimal concessions, only if reciprocated"
    elif weight > 30:
        return "Selective concessions on lower priority issues"
    else:
        return "Willing to make concessions to build relationships"

def _generate_confidential_notes(party_name: str, issue_title: str, weight: float, batna: str) -> List[str]:
    """Generate confidential notes"""
    notes = []
    
    if weight > 70:
        notes.append(f"Critical issue for {party_name} - cannot afford to lose")
        notes.append("Consider aggressive tactics if necessary")
    
    if not batna or len(batna.strip()) < 20:
        notes.append("Weak BATNA - need to be more flexible")
        notes.append("Consider building relationships for future negotiations")
    
    notes.append(f"Monitor other parties' positions on {issue_title}")
    notes.append("Prepare for unexpected developments and adapt strategy")
    
    return notes
