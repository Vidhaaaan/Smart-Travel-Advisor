def hotel_strategy(city, budget):
    strategy = {
        "budget": {
            "price_range": "₹800 – ₹2,000",
            "hotel_type": "Budget hotels, hostels, lodges"
        },
        "mid": {
            "price_range": "₹2,500 – ₹6,000",
            "hotel_type": "3★ – 4★ hotels"
        },
        "luxury": {
            "price_range": "₹8,000 – ₹20,000",
            "hotel_type": "4★ – 5★ premium hotels & resorts"
        }
    }

    data = strategy.get(budget, strategy["mid"])

    return {
        "city": city,
        "budget": budget,
        "price_range": data["price_range"],
        "hotel_type": data["hotel_type"],
        "maps_link": f"https://www.google.com/maps/search/{budget}+hotels+in+{city}"
    }
