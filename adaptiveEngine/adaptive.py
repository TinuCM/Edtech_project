from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="Adaptive Learning Engine (Kids)")



# INPUT MODELS
class Attempt(BaseModel):
    topic: str
    difficulty: str        # easy,medium,hard
    is_correct: bool


class AdaptiveRequest(BaseModel):
    child_id: str
    subject: str
    attempts: List[Attempt]   # ordered: oldest -> newest



# OUTPUT MODEL


class AdaptiveResponse(BaseModel):
    next_difficulty: str
    next_topic: str
    strategy: str
    mastery: float
    confidence: float
    reason: str



# STUDENT STATE MODEL
class StudentState:

   # Represents the child's learning state

    def __init__(self, mastery=0.5, confidence=0.5):
        self.mastery = mastery
        self.confidence = confidence



# UTILITY FUNCTIONS
def clamp(value: float) -> float:
    return max(0.0, min(1.0, value))


def has_consecutive_wrongs(attempts: List[Attempt], count: int = 2) -> bool:
    if len(attempts) < count:
        return False
    return all(not a.is_correct for a in attempts[-count:])


def has_consecutive_corrects(attempts: List[Attempt], count: int = 2) -> bool:
    if len(attempts) < count:
        return False
    return all(a.is_correct for a in attempts[-count:])


def increase_difficulty(current: str) -> str:
    order = ["easy", "medium", "hard"]
    idx = order.index(current)
    return order[min(idx + 1, len(order) - 1)]


def lower_difficulty(current: str) -> str:
    order = ["easy", "medium", "hard"]
    idx = order.index(current)
    return order[max(idx - 1, 0)]


# STATE UPDATE (MODEL)


def update_state(state: StudentState, attempt: Attempt) -> StudentState:

   # Update mastery & confidence based on correctness

    if attempt.is_correct:
        state.mastery += 0.06
        state.confidence += 0.05
    else:
        state.mastery -= 0.08
        state.confidence -= 0.06

    state.mastery = clamp(state.mastery)
    state.confidence = clamp(state.confidence)

    return state



# MODEL-BASED DECISION
def decide_from_state(state: StudentState) -> Dict:

    #Decide difficulty

    if state.mastery < 0.4:
        return {
            "difficulty": "easy",
            "strategy": "revise",
            "reason": "Low mastery detected"
        }

    if state.mastery > 0.75 and state.confidence > 0.7:
        return {
            "difficulty": "hard",
            "strategy": "advance",
            "reason": "High mastery and confidence"
        }

    return {
        "difficulty": "medium",
        "strategy": "practice",
        "reason": "Stable learning in progress"
    }


def decide_topic(attempts: List[Attempt], strategy: str) -> str:

    #Decide which topic to serve next

    current_topic = attempts[-1].topic

    if strategy == "advance":
        return "next_topic"   # Node map this

    return current_topic



# MAIN API ENDPOINT
@app.post("/adaptive/next", response_model=AdaptiveResponse)
def get_next_question_decision(payload: AdaptiveRequest):

    attempts = payload.attempts
    last_attempt = attempts[-1]

    # STEP 1: BUILD STUDENT STATE
    state = StudentState()
    for attempt in attempts:
        state = update_state(state, attempt)

    # STEP 2: IMMEDIATE BEHAVIOR RULES (PRIORITY)
    # 2 consecutive wrong → difficulty down
    if has_consecutive_wrongs(attempts, count=2):
        next_difficulty = lower_difficulty(last_attempt.difficulty)
        strategy = "revise"
        reason = "Two consecutive wrong answers detected"
    # 2 consecutive correct → difficulty up
    elif has_consecutive_corrects(attempts, count=2):
        next_difficulty = increase_difficulty(last_attempt.difficulty)
        strategy = "advance"
        reason = "Two consecutive correct answers detected"


    # STEP 3: MODEL-BASED DECISION
    else:
        decision = decide_from_state(state)
        next_difficulty = decision["difficulty"]
        strategy = decision["strategy"]
        reason = decision["reason"]


    # STEP 4: TOPIC DECISION
    next_topic = decide_topic(attempts, strategy)

    return AdaptiveResponse(
        next_difficulty=next_difficulty,
        next_topic=next_topic,
        strategy=strategy,
        mastery=round(state.mastery, 2),
        confidence=round(state.confidence, 2),
        reason=reason
    )


#api 
@app.get("/")
def root():
    return {"status": "Adaptive Learning Engine running"}
