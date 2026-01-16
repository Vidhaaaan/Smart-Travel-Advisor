import csv
import json

places = []

with open("Expanded_Indian_Travel_Dataset.csv", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for row in reader:
        place = {
            "name": row["Destination Name"],
            "state": row["State"],
            "region": row["Region"],

            # Mapping category -> interest
            "interests": [row["Category"].lower()],

            # Derived expert-system fields
            "budget": "medium",
            "season": ["winter", "summer"],
            "travel_type": ["family", "friends", "solo"],
            "accessibility": row["Accessibility"],
            "popular_attraction": row["Popular Attraction"],
            "nearest_airport": row["Nearest Airport"],
            "nearest_railway": row["Nearest Railway Station"]
        }

        places.append(place)

with open("places.json", "w", encoding="utf-8") as f:
    json.dump(places, f, indent=2)

print(f"✅ places.json created with {len(places)} destinations")
