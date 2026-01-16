# inference.py
import pandas as pd

# ===============================
# Load dataset
# ===============================
df = pd.read_csv("places_enriched.csv")
df = df.fillna("")

# ===============================
# HARD FILTERS (STRICT REJECTION)
# ===============================
def reject_place(row, user):
    season = user.get("season", "").lower()
    travel_type = user.get("travel_type", "").lower()
    budget = user.get("budget", "").lower()

    category = row["Category"].lower()
    accessibility = row["Accessibility"].lower()

    # ❌ Family + very difficult terrain
    if travel_type == "family" and accessibility == "difficult":
        return True

    # ❌ Budget travelers + difficult adventure/beach
    if budget == "budget" and accessibility == "difficult":
        return True

    # ❌ Summer + desert regions
    if season == "summer" and category == "desert":
        return True

    return False


# ===============================
# SCORING FUNCTIONS
# ===============================
def category_score(category, interest):
    category = category.lower()
    interest = interest.lower()

    if interest in category:
        return 1.0

    soft_map = {
        "nature": ["adventure", "beach"],
        "adventure": ["nature"],
        "spiritual": ["religious", "heritage"],
        "culture": ["heritage"]
    }

    if interest in soft_map and category in soft_map[interest]:
        return 0.7

    return 0.3


def travel_type_score(travel_type, category):
    travel_type = travel_type.lower()
    category = category.lower()

    matrix = {
        "family": {"heritage": 1.0, "religious": 1.0, "nature": 0.9, "city": 0.8},
        "solo": {"adventure": 1.0, "spiritual": 0.9, "nature": 0.8},
        "couple": {"beach": 1.0, "nature": 0.9, "heritage": 0.8},
        "friends": {"adventure": 1.0, "beach": 1.0, "city": 0.8}
    }

    return matrix.get(travel_type, {}).get(category, 0.5)


def accessibility_score(level):
    level = level.lower()
    if level == "easy":
        return 1.0
    if level == "moderate":
        return 0.7
    return 0.4


def budget_score(budget, category):
    budget = budget.lower()
    category = category.lower()

    if budget == "budget":
        return 1.0 if category in ["heritage", "religious", "city", "nature"] else 0.4
    if budget == "mid":
        return 0.8
    if budget == "luxury":
        return 1.0 if category in ["beach", "heritage", "nature"] else 0.6

    return 0.6


def season_score(season, category):
    season = season.lower()
    category = category.lower()

    if season == "summer" and category in ["hill station", "nature"]:
        return 1.0
    if season == "winter" and category in ["beach", "heritage", "religious"]:
        return 1.0
    if season == "monsoon" and category in ["hill station"]:
        return 0.6

    return 0.8


# ===============================
# FEATURE 7: EXPLANATION ENGINE
# ===============================
def build_reason(row, user):
    reasons = []

    if user["interest"].lower() in row["Category"].lower():
        reasons.append("Matches your interest perfectly")

    if row["Accessibility"].lower() == "easy":
        reasons.append("Easy to travel and well-connected")

    if user["travel_type"] == "family" and row["Category"].lower() in ["heritage", "religious"]:
        reasons.append("Family-friendly destination")

    if user["budget"] == "budget" and row["Category"].lower() in ["heritage", "city"]:
        reasons.append("Affordable for your budget")

    return reasons


# ===============================
# FEATURE 5: SMART WARNINGS
# ===============================
def build_warnings(row, user):
    warnings = []

    season = user["season"]
    category = row["Category"].lower()
    accessibility = row["Accessibility"].lower()
    budget = user["budget"]

    if season == "summer" and category in ["city", "desert"]:
        warnings.append("High temperature expected during summer")

    if season == "monsoon" and accessibility == "difficult":
        warnings.append("Travel disruptions possible during monsoon")

    if budget == "budget" and accessibility == "moderate":
        warnings.append("Expenses may exceed budget if not planned carefully")

    return warnings


# ===============================
# MAIN INFERENCE ENGINE
# ===============================
def run_inference(user):
    results = []

    for _, row in df.iterrows():

        # ❌ Hard reject
        if reject_place(row, user):
            continue

        category = row["Category"]
        region = row["Region"]

        score = (
            0.30 * category_score(category, user["interest"]) +
            0.25 * travel_type_score(user["travel_type"], category) +
            0.15 * accessibility_score(row["Accessibility"]) +
            0.15 * budget_score(user["budget"], category) +
            0.15 * season_score(user["season"], category)
        )

        results.append({
            "name": row["Destination Name"],
            "description": f"{row['Popular Attraction']} · {row['State']}",
            "region": region,
            "category": category,
            "raw_score": score,
            "why_recommended": build_reason(row, user),
            "warnings": build_warnings(row, user)
        })

    if not results:
        return {"recommendations": []}

    df_res = pd.DataFrame(results).sort_values("raw_score", ascending=False)

    # ===============================
    # Diversity Control
    # ===============================
    final = []
    used_regions = set()

    for _, r in df_res.iterrows():
        if r["region"] in used_regions:
            continue
        final.append(r)
        used_regions.add(r["region"])
        if len(final) == 5:
            break

    final_df = pd.DataFrame(final)

    # ===============================
    # Normalize score to %
    # ===============================
    min_s, max_s = final_df["raw_score"].min(), final_df["raw_score"].max()

    def normalize(x):
        if min_s == max_s:
            return 85.0
        return round(65 + ((x - min_s) / (max_s - min_s)) * 30, 1)

    final_df["match_percentage"] = final_df["raw_score"].apply(normalize)

    return {
        "recommendations": final_df[[
            "name",
            "description",
            "match_percentage",
            "why_recommended",
            "warnings"
        ]].to_dict(orient="records"),
        "explanation": (
            "AI recommendations consider budget realism, season safety, "
            "travel difficulty, personal preferences and destination diversity."
        )
    }
