from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
from google.api_core.exceptions import InvalidArgument

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for React frontend
CORS(app, resources={r"/chat": {"origins": "http://localhost:3000"}})

# Configure GenerativeAI
try:
    genai.configure(api_key=os.getenv("API_KEY"))
except InvalidArgument as e:
    print(f"Error configuring GenerativeAI API: {e}")
    print("Please check your API key and ensure it is valid.")
    exit()

# Initialize the model
try:
    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
except InvalidArgument as e:
    print(f"Error initializing GenerativeModel: {e}")
    print("Please check the model name format.")
    exit()

# Start chat session
chat = model.start_chat(history=[])

def replace_double_asterisks_with_space(text):
    """Replace all occurrences of ** with a single space."""
    return text.replace("**", " ")

@app.route("/", methods=["GET"])
def home():
    return "<h1>Welcome to the Chatbot API</h1><p>Use the /chat endpoint to communicate with the bot.</p>"

@app.route("/chat", methods=["POST"])
def chat_with_bot():
    try:
        # Get user input and preprocess it
        user_input = request.json.get("message")
        if not user_input:
            return jsonify({"error": "No message provided"}), 400
        
        # Replace ** with space in user input
        processed_input = replace_double_asterisks_with_space(user_input)

        # Send the message to the chatbot
        response = chat.send_message(processed_input, stream=True)
        bot_response = ""
        for chunk in response:
            if chunk.text:
                bot_response += chunk.text

        # Replace ** with space in bot response
        processed_response = replace_double_asterisks_with_space(bot_response)

        return jsonify({"response": processed_response})

    except InvalidArgument as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Error querying GenerativeAI API: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
