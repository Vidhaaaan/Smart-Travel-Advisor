from flask import Flask, request, jsonify
from flask_cors import CORS

from inference import run_inference
from itinerary import generate_itinerary

# ===============================
# APP INITIALIZATION
# ===============================
app = Flask(__name__)
CORS(app)


# ===============================
# HEALTH CHECK (DEPLOYMENT READY)
# ===============================
@app.route("/", methods=["GET"])
def health_check():
    """
    Used by deployment platforms (Render / Railway)
    """
    return jsonify({
        "status": "Yatri.in backend running 🚀",
        "service": "AI Travel Recommendation Engine"
    })


# ===============================
# DESTINATION RECOMMENDATION API
# ===============================
@app.route("/recommend", methods=["POST"])
def recommend():
    """
    Returns top AI-curated destinations
    based on user preferences
    """
    try:
        user_data = request.get_json() or {}

        result = run_inference(user_data)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": "Recommendation engine failed",
            "details": str(e)
        }), 400


# ===============================
# ITINERARY + BUDGET API
# ===============================
@app.route("/itinerary", methods=["POST"])
def itinerary_api():
    """
    Generates day-wise itinerary
    with hidden budget breakdown
    (frontend toggles visibility)
    """
    try:
        data = request.get_json() or {}

        place = data.get("place")
        days = int(data.get("days", 3))
        members = int(data.get("members", 1))
        ages = data.get("ages", "")
        budget = data.get("budget", "mid")  # 🔥 VERY IMPORTANT

        if not place:
            return jsonify({
                "error": "Destination name is required"
            }), 400

        result = generate_itinerary(
            place=place,
            days=days,
            members=members,
            ages=ages,
            budget=budget
        )

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": "Itinerary generation failed",
            "details": str(e)
        }), 400


# ===============================
# OPTIONAL: AI EXPLANATION API
# (Great for Hackathon Judges)
# ===============================
@app.route("/explain", methods=["POST"])
def explain_logic():
    """
    Explains why destinations were recommended
    """
    try:
        user_data = request.get_json() or {}
        result = run_inference(user_data)

        return jsonify({
            "explanation": result.get("explanation", ""),
            "note": "Transparent & explainable AI"
        })

    except Exception as e:
        return jsonify({
            "error": "Explanation failed",
            "details": str(e)
        }), 400


# ===============================
# APP RUN
# ===============================
if __name__ == "__main__":
    app.run(debug=True)
