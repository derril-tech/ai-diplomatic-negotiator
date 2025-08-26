from celery import shared_task
from typing import Dict, Any, List, Optional
import structlog
import random
import math

logger = structlog.get_logger()

@shared_task
def propose_offer(party_data: Dict[str, Any], issue_data: Dict[str, Any], 
                  preference_data: Dict[str, Any], round_number: int,
                  previous_offers: List[Dict[str, Any]] = None,
                  other_parties_preferences: List[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Generate a negotiation offer for a party on a specific issue"""
    logger.info("Starting offer proposal",
               party_id=party_data.get('id'),
               issue_id=issue_data.get('id'),
               round_number=round_number)
    
    try:
        # Extract key data
        party_name = party_data.get('name', 'Unknown Party')
        issue_title = issue_data.get('title', 'Unknown Issue')
        issue_type = issue_data.get('type', 'distributive')
        weight = preference_data.get('weight', 0.5)
        reservation_value = preference_data.get('reservation_value', 0)
        target_value = preference_data.get('target_value', 100)
        current_value = preference_data.get('current_value', 50)
        
        # Analyze previous offers to understand negotiation pattern
        concession_pattern = _analyze_concession_pattern(previous_offers, party_name)
        
        # Determine offer strategy based on round and context
        strategy = _determine_offer_strategy(round_number, weight, issue_type, concession_pattern)
        
        # Calculate proposed value
        proposed_value = _calculate_proposed_value(
            current_value, target_value, reservation_value, 
            round_number, strategy, weight, issue_type
        )
        
        # Generate rationale for the offer
        rationale = _generate_offer_rationale(
            party_name, issue_title, proposed_value, current_value,
            strategy, round_number, weight, issue_type
        )
        
        # Create offer structure
        offer = {
            "party_id": party_data.get('id'),
            "issue_id": issue_data.get('id'),
            "round_number": round_number,
            "proposed_value": proposed_value,
            "strategy": strategy,
            "rationale": rationale,
            "confidence": _calculate_confidence(weight, round_number, concession_pattern),
            "flexibility": _assess_flexibility(weight, issue_type, round_number),
            "timestamp": "2024-12-19T15:45:00Z"  # TODO: Use actual timestamp
        }
        
        logger.info("Offer proposal completed",
                   party_id=party_data.get('id'),
                   issue_id=issue_data.get('id'),
                   proposed_value=proposed_value,
                   strategy=strategy)
        
        return {
            "status": "success",
            "offer": offer,
            "party_id": party_data.get('id'),
            "issue_id": issue_data.get('id')
        }
        
    except Exception as e:
        logger.error("Offer proposal failed",
                    party_id=party_data.get('id'),
                    issue_id=issue_data.get('id'),
                    error=str(e))
        return {
            "status": "failed",
            "error": str(e),
            "party_id": party_data.get('id'),
            "issue_id": issue_data.get('id')
        }

def _analyze_concession_pattern(previous_offers: List[Dict[str, Any]], party_name: str) -> Dict[str, Any]:
    """Analyze previous offers to understand concession patterns"""
    if not previous_offers:
        return {"pattern": "initial", "concession_rate": 0.0, "consistency": "unknown"}
    
    party_offers = [offer for offer in previous_offers if offer.get('party_name') == party_name]
    
    if len(party_offers) < 2:
        return {"pattern": "insufficient_data", "concession_rate": 0.0, "consistency": "unknown"}
    
    # Calculate concession rate
    concessions = []
    for i in range(1, len(party_offers)):
        prev_value = party_offers[i-1].get('proposed_value', 0)
        curr_value = party_offers[i].get('proposed_value', 0)
        concession = abs(curr_value - prev_value)
        concessions.append(concession)
    
    avg_concession = sum(concessions) / len(concessions) if concessions else 0
    
    # Determine pattern
    if avg_concession < 2:
        pattern = "hardline"
    elif avg_concession < 5:
        pattern = "moderate"
    else:
        pattern = "flexible"
    
    return {
        "pattern": pattern,
        "concession_rate": avg_concession,
        "consistency": "consistent" if len(set(concessions)) <= 2 else "variable"
    }

def _determine_offer_strategy(round_number: int, weight: float, issue_type: str, 
                            concession_pattern: Dict[str, Any]) -> str:
    """Determine the strategy for this offer"""
    
    if round_number == 1:
        return "opening_position"
    
    if weight > 0.8:
        if concession_pattern.get('pattern') == 'hardline':
            return "maintain_position"
        else:
            return "minimal_concession"
    
    elif weight > 0.5:
        if round_number > 3:
            return "moderate_concession"
        else:
            return "hold_position"
    
    else:  # low weight
        if round_number > 2:
            return "flexible_concession"
        else:
            return "moderate_concession"
    
    return "standard_concession"

def _calculate_proposed_value(current_value: float, target_value: float, 
                            reservation_value: float, round_number: int,
                            strategy: str, weight: float, issue_type: str) -> float:
    """Calculate the proposed value based on strategy and context"""
    
    # Base calculation
    if strategy == "opening_position":
        # Start closer to target for high-weight issues
        if weight > 0.7:
            return target_value * 0.9
        else:
            return target_value * 0.8
    
    elif strategy == "maintain_position":
        return current_value
    
    elif strategy == "minimal_concession":
        concession = (target_value - reservation_value) * 0.05 * weight
        return max(current_value - concession, reservation_value)
    
    elif strategy == "moderate_concession":
        concession = (target_value - reservation_value) * 0.1 * weight
        return max(current_value - concession, reservation_value)
    
    elif strategy == "flexible_concession":
        concession = (target_value - reservation_value) * 0.15 * weight
        return max(current_value - concession, reservation_value)
    
    elif strategy == "hold_position":
        return current_value
    
    else:  # standard_concession
        concession = (target_value - reservation_value) * 0.08 * weight
        return max(current_value - concession, reservation_value)

def _generate_offer_rationale(party_name: str, issue_title: str, proposed_value: float,
                             current_value: float, strategy: str, round_number: int,
                             weight: float, issue_type: str) -> str:
    """Generate a rationale for the proposed offer"""
    
    change = proposed_value - current_value
    
    if strategy == "opening_position":
        return f"{party_name} presents initial position on {issue_title} at {proposed_value:.1f}, " \
               f"reflecting our core interests and priorities in this negotiation."
    
    elif strategy == "maintain_position":
        return f"{party_name} maintains our position at {proposed_value:.1f} on {issue_title}, " \
               f"as this issue remains critical to our objectives."
    
    elif strategy == "minimal_concession":
        return f"{party_name} makes a limited adjustment to {proposed_value:.1f} on {issue_title}, " \
               f"demonstrating our willingness to engage while protecting vital interests."
    
    elif strategy == "moderate_concession":
        return f"{party_name} proposes {proposed_value:.1f} on {issue_title}, " \
               f"showing flexibility to advance the negotiation toward a mutually beneficial outcome."
    
    elif strategy == "flexible_concession":
        return f"{party_name} offers {proposed_value:.1f} on {issue_title}, " \
               f"making a significant concession to demonstrate our commitment to reaching agreement."
    
    elif strategy == "hold_position":
        return f"{party_name} maintains our position at {proposed_value:.1f} on {issue_title}, " \
               f"seeking to understand other parties' positions before making further adjustments."
    
    else:
        return f"{party_name} proposes {proposed_value:.1f} on {issue_title}, " \
               f"aiming to move the negotiation forward constructively."

def _calculate_confidence(weight: float, round_number: int, 
                         concession_pattern: Dict[str, Any]) -> float:
    """Calculate confidence level in the offer"""
    
    # Base confidence on weight
    base_confidence = weight * 0.8 + 0.2
    
    # Adjust for round number (confidence decreases in later rounds)
    round_factor = max(0.5, 1.0 - (round_number - 1) * 0.1)
    
    # Adjust for concession pattern
    pattern_factor = 1.0
    if concession_pattern.get('pattern') == 'consistent':
        pattern_factor = 1.1
    elif concession_pattern.get('pattern') == 'variable':
        pattern_factor = 0.9
    
    confidence = base_confidence * round_factor * pattern_factor
    return min(1.0, max(0.1, confidence))

def _assess_flexibility(weight: float, issue_type: str, round_number: int) -> str:
    """Assess the party's flexibility on this issue"""
    
    if weight > 0.8:
        return "low"
    elif weight > 0.5:
        if round_number > 3:
            return "moderate"
        else:
            return "low"
    else:
        if round_number > 2:
            return "high"
        else:
            return "moderate"
