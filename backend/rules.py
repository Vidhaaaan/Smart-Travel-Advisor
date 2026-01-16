# rules.py
# Expert rules for travel recommendation system

rules = [
    {
        "id": 1,
        "conditions": {"interest": "nature"},
        "weight": 4,
        "reason": "Matches user's nature preference"
    },
    {
        "id": 2,
        "conditions": {"interest": "heritage"},
        "weight": 4,
        "reason": "Matches user's heritage interest"
    },
    {
        "id": 3,
        "conditions": {"interest": "religious"},
        "weight": 4,
        "reason": "Matches user's religious interest"
    },
    {
        "id": 4,
        "conditions": {"interest": "beach"},
        "weight": 4,
        "reason": "Matches user's beach interest"
    },
    {
        "id": 5,
        "conditions": {"travel_type": "family"},
        "weight": 2,
        "reason": "Suitable for family travel"
    },
    {
        "id": 6,
        "conditions": {"travel_type": "solo"},
        "weight": 2,
        "reason": "Suitable for solo travel"
    },
    {
        "id": 7,
        "conditions": {"travel_type": "friends"},
        "weight": 2,
        "reason": "Suitable for group travel"
    }
]
