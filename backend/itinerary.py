# itinerary.py
import pandas as pd

# ===============================
# Load dataset
# ===============================
df = pd.read_csv("places_enriched.csv")
df = df.fillna("")


# ===============================
# BASE COST BY USER BUDGET
# (₹ per person per day – India realistic)
# ===============================
BUDGET_BASE_COST = {
    "budget": 1800,     # hostels, buses, street food
    "mid": 3200,        # 3-star hotels, shared cabs
    "luxury": 7000      # resorts, private cabs
}


# ===============================
# Day-type multipliers
# ===============================
DAY_MULTIPLIER = {
    "arrival": 1.30,   # travel + check-in
    "heavy": 1.15,     # full sightseeing
    "normal": 1.00,
    "light": 0.75,     # rest / cafes
    "last": 0.90       # checkout + shopping
}


# ===============================
# Expense split (realistic)
# ===============================
EXPENSE_SPLIT = {
    "hotel": 0.40,
    "food": 0.30,
    "travel": 0.20,
    "activities": 0.10
}


# ===============================
# Helper: determine day type
# ===============================
def get_day_type(day, total_days):
    if day == 1:
        return "arrival"
    if day == total_days:
        return "last"
    if day % 3 == 0:
        return "light"
    return "heavy"


# ===============================
# Helper: calculate day-wise budget
# ===============================
def calculate_day_budget(base_cost, members, day_type):
    multiplier = DAY_MULTIPLIER.get(day_type, 1.0)
    adjusted = base_cost * multiplier

    hotel = adjusted * EXPENSE_SPLIT["hotel"]
    food = adjusted * EXPENSE_SPLIT["food"]
    travel = adjusted * EXPENSE_SPLIT["travel"]
    activities = adjusted * EXPENSE_SPLIT["activities"]

    return {
        "day_type": day_type,
        "hotel": round(hotel * members),
        "food": round(food * members),
        "travel": round(travel * members),
        "activities": round(activities * members),
        "total": round((hotel + food + travel + activities) * members)
    }


# ===============================
# Helper: build plan text
# ===============================
def build_day_plan(places, category):
    category = category.lower()

    prefix_map = {
        "adventure": "Adventure activities and sightseeing at",
        "nature": "Nature exploration at",
        "beach": "Relax and enjoy beach experiences at",
        "religious": "Spiritual visits to",
        "heritage": "Historical sightseeing at"
    }

    prefix = prefix_map.get(category, "Sightseeing at")
    return f"{prefix} {', '.join(places)}."


# ===============================
# MAIN ITINERARY GENERATOR
# ===============================
def generate_itinerary(place, days, members, ages, budget="mid"):
    """
    Generates realistic itinerary with
    hidden day-wise budget (frontend toggle)
    """

    base_cost = BUDGET_BASE_COST.get(budget, BUDGET_BASE_COST["mid"])

    row = df[df["Destination Name"].str.lower() == place.lower()]

    # ---------- fallback ----------
    if row.empty:
        return {
            "place": place,
            "members": members,
            "ages": ages,
            "budget_type": budget,
            "itinerary": [{
                "day": 1,
                "plan": "Arrival, hotel check-in and local exploration.",
                "budget": calculate_day_budget(base_cost, members, "arrival")
            }]
        }

    row = row.iloc[0]

    famous_places = [
        p.strip() for p in row["Famous Places"].split(",") if p.strip()
    ]

    category = row["Category"]
    state = row["State"]

    itinerary = []
    per_day = max(1, len(famous_places) // days)
    index = 0

    for day in range(1, days + 1):

        day_type = get_day_type(day, days)
        day_budget = calculate_day_budget(base_cost, members, day_type)

        # ---------- Day plan ----------
        if day == 1:
            plan = (
                f"Arrival at {place}, {state}. "
                f"Hotel check-in and evening walk. "
                f"Visit {famous_places[0]}."
            )
            index = 1

        elif day == days:
            remaining = famous_places[index:]
            plan = build_day_plan(remaining, category) if remaining \
                else "Shopping, leisure time and departure."

        else:
            today_places = famous_places[index:index + per_day]
            index += per_day
            plan = build_day_plan(today_places, category) if today_places \
                else "Leisure day to relax and explore local markets."

        itinerary.append({
            "day": day,
            "plan": plan,
            "budget": day_budget
        })

    return {
        "place": place,
        "members": members,
        "ages": ages,
        "budget_type": budget,
        "itinerary": itinerary
    }
