import identity
import identity.web
import requests
from flask import Flask, redirect, render_template, request, session, url_for, jsonify
from flask_session import Session
from flask_cors import CORS
from clarifai.client.model import Model
from pymongo import MongoClient #pip install pymongo
import openai
import os
import base64
import dotenv
import json
dotenv.load_dotenv()

import app_config

app = Flask(__name__)
CORS(app)
app.config.from_object(app_config)
Session(app)
sessionData = {
    "9th Grade": { 
        "Computer": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Chemistry": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Physics": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Biology": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "English": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Mathematics": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Urdu": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Islamiyat": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        }
    },
    "10th Grade": { 
        "Computer": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Chemistry": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Physics": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Biology": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "English": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Mathematics": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Pak Studies": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Sindhi": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        }
    },
    "11th Grade": { 
        "Computer": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Chemistry": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Physics": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Biology": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "English": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Mathematics": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Urdu": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Islamiyat": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        }
    },
    "12th Grade": { 
        "Computer": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Chemistry": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Physics": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Biology": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "English": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Mathematics": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Urdu": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        },
        "Pak Studies": {
            "messages": [],
            "bot_tokens": 0,
            "user_tokens": 0
        }
    }
}

mongo_client = MongoClient('mongodb+srv://HuzaifaGhori:Huzaifa1@cluster0.xa8q1tb.mongodb.net/')
db = mongo_client['curricuai']
user_sessions_collection = db['userSessionsData']
board_collection = db['listedBoards']
# get array in board_collection

def update_subject_data(user_id, grade, subject, updated_data):
    # Update data in MongoDB
    result = user_sessions_collection.find_one_and_update(
        {"email": user_id, f"sessionsData.{grade}.{subject}": {"$exists": True}},
        {"$set": {f"sessionsData.{grade}.{subject}.{key}": value for key, value in updated_data.items()}},
        projection={f"sessionsData.{grade}.{subject}": 1},
        return_document=True
    )
    return result

# Configure MongoDB
def get_subject_data(user_id, grade, subject):
    result = user_sessions_collection.find_one(
        {"email": user_id, f"sessionsData.{grade}.{subject}": {"$exists": True}},
        projection={f"sessionsData.{grade}.{subject}": 1}
    )
    return result

@app.route('/api/get_subject_data', methods=['GET'])
def api_get_subject_data():
    user_id = user_email  # Replace with the actual user ID
    grade = grade_data      # Replace with the actual grade
    subject = subject_name  # Replace with the actual subject
    
    subject_data = get_subject_data(user_id, grade, subject)
    
    if subject_data and subject_data.get('sessionsData', {}).get(grade, {}).get(subject):
        messages = subject_data['sessionsData'][grade][subject]['messages']
        return jsonify({"messages": messages})
    else:
        return jsonify({"error": "Data not found"}), 404

def resToPromp(prom):
    # openai.api_type = "azure"
    # openai.api_version = "2023-08-01-preview"
    # openai.api_base = "https://curricuaimodel.openai.azure.com/"
    # openai.api_key = os.getenv("OPENAI_API_KEY")
    message_text = [{"role":"system","content":"You are an AI assistant that helps people find information."},{"role":"user","content":f"can you write prompt for dall e to generate image for the given Message Text: {prom}"}]
    # message_text = [{"role":"system","content":"You are an AI assistant that helps people find information."},{"role":"user","content":"hello"},{"role":"assistant","content":"Hello! How can I assist you today?"},{"role":"user","content":"can you write prompt for dall e to generate image for the given Message Text: The evolution of computers is generally divided into three eras: Mechanical Era, Electro-mechanical Era, and Electronic Era[doc3][doc4]. The first computer prototype was the Abacus, which was invented about 5000 years ago[doc4]. It is still used to teach basic arithmetic operations to students[doc4]."}]


    completion = openai.ChatCompletion.create(
    engine="gpt-35-turbo",
    messages = message_text,
    temperature=0.7,
    max_tokens=800,
    top_p=0.95,
    frequency_penalty=0,
    presence_penalty=0,
    stop=None
    )
    # print(completion["choices"][0]["message"]['content'])
    return completion["choices"][0]["message"]['content']
# Code 1 - Clarifai Setup
CLARIFAI_PAT = os.getenv('CLARIFAI_PAT')
# prompt = "Ultimate god form of goku from dragon ball z"
inference_params = dict(quality="standard", size='1024x1024')
model = Model("https://clarifai.com/openai/dall-e/models/dall-e-3")

# Code 2 - OpenAI Setup
openai.api_type = "azure"
openai.api_version = "2023-08-01-preview"
openai.api_base = "https://curricuaimodel.openai.azure.com/"
openai.api_key = os.getenv("OPENAI_API_KEY")
deployment_id = "gpt-35-turbo"
search_endpoint = "https://servicesearchimaginecup.search.windows.net"
search_key = os.getenv("SEARCH_KEY")
search_index_name = "pdf3"

def reset_openai_sdk():
    openai.requestssession = None
    # Set the default OpenAI SDK configuration
    openai.api_type = "azure"
    openai.api_version = "2023-08-01-preview"
    openai.api_base = "https://curricuaimodel.openai.azure.com/"
    openai.api_key = os.getenv("OPENAI_API_KEY")

# Call this function to reset OpenAI SDK to the default configuration



def setup_byod(deployment_id: str) -> None:
    class BringYourOwnDataAdapter(requests.adapters.HTTPAdapter):
        def send(self, request, **kwargs):
            request.url = f"{openai.api_base}/openai/deployments/{deployment_id}/extensions/chat/completions?api-version={openai.api_version}"
            return super().send(request, **kwargs)

    session = requests.Session()
    session.mount(
        prefix=f"{openai.api_base}/openai/deployments/{deployment_id}",
        adapter=BringYourOwnDataAdapter()
    )
    openai.requestssession = session
    # end session
    
# setup_byod(deployment_id)
# response = resToPromp("The evolution of computers is generally divided into three eras: Mechanical Era, Electro-mechanical Era, and Electronic Era[doc3][doc4]. The first computer prototype was the Abacus, which was invented about 5000 years ago[doc4]. It is still used to teach basic arithmetic operations to students[doc4].")
# print(response)
# Endpoint for Code 1
@app.route('/generate-image', methods=['POST'])
def generate_image():
    reset_openai_sdk()
        
    try:
        if request.method == 'POST':
            prompt = request.json.get('prompt', '')

            prompt = resToPromp(prompt)
            # prompt = resToPromp(prompt)
            model_prediction = model.predict_by_bytes(prompt.encode(), input_type="text", inference_params=inference_params)
            output_base64 = model_prediction.outputs[0].data.image.base64

            # Convert bytes to base64-encoded string
            output_base64_str = base64.b64encode(output_base64).decode('utf-8')

            response_data = {'image_data': output_base64_str, 'success': True}
            return jsonify(response_data)
        else:
            return jsonify({'error': 'Method not allowed', 'success': False}), 405
    except Exception as e:
        return jsonify({'error': str(e), 'success': False})

# Endpoint for Code 2
@app.route('/get-completion', methods=['POST'])
def get_completion():
    setup_byod(deployment_id)
    try:
        if request.method == 'POST':
            prompt = request.json.get('prompt', '')
            # message_text = [{"role": "system", "content": "You are a helpful assistant,You must use Urdu language and avoid the use of Hindi language."},
            #     {"role": "user", "content": prompt}]
            print(len(prompt))
            if(len(prompt) > 11):
                message_text = [prompt[0]]
                x_len = len(prompt) - 10
                if(x_len < 0):
                    x_len = 1
                for i in range(x_len,len(prompt)):
                    message_text.append(prompt[i])
            else:
                message_text = prompt

            print(len(message_text))
            print(grade_data, subject_name,len(message_text))
            completion = openai.ChatCompletion.create(
                messages=message_text,
                deployment_id=deployment_id,
                dataSources=[
                    {
                        "type": "AzureCognitiveSearch",
                        "parameters": {
                            "endpoint": search_endpoint,
                            "key": search_key,
                            "indexName": search_index_name,
                        }
                    }
                ]
            )
            
            result = completion["choices"][0]["message"]['content']
            botObject = {"role": completion["choices"][0]["message"]['role'], "content": result} 
            message_text_history = prompt + [botObject]
            print(message_text_history)
            # Example usage
            updated_data = {"messages": message_text_history, "bot_tokens": 10, "user_tokens": 10}
            subject_data = update_subject_data(user_email, grade_data, subject_name, updated_data)
            print(subject_data)
            response_data = {'result': result, 'success': True}
            return jsonify(response_data)
        else:
            return jsonify({'error': 'Method not allowed', 'success': False}), 405
    except Exception as e:
        return jsonify({'error': str(e), 'success': False})

# This section is needed for url_for("foo", _external=True) to automatically
# generate http scheme when this sample is running on localhost,
# and to generate https scheme when it is deployed behind reversed proxy.
# See also https://flask.palletsprojects.com/en/2.2.x/deploying/proxy_fix/
from werkzeug.middleware.proxy_fix import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

auth = identity.web.Auth(
    session=session,
    authority=app.config.get("AUTHORITY"),
    client_id=app.config["CLIENT_ID"],
    client_credential=app.config["CLIENT_SECRET"],
)

user_name = None
@app.route("/login")
def login():
    return render_template("index.html", version=identity.__version__, **auth.log_in(
        scopes=app_config.SCOPE, # Have user consent to scopes during log-in
        redirect_uri=url_for("auth_response", _external=True), # Optional. If present, this absolute URL must match your app's redirect_uri registered in Azure Portal
        ))

# render chat.html
@app.route("/chat")
def chat():
    return render_template("chat.html", version=identity.__version__, user_name=user_name)

@app.route("/getSubjectName", methods=["GET","POST"])
def getSubjectName():
    if not auth.get_user():
        return jsonify({"error": "User not authenticated"})
    if auth.get_user():
        global user_name
        user_name = auth.get_user()["name"]
    
    if request.method == "POST":
        data = request.json.get('subject_name','')
        global subject_name
        subject_name = data
        print(data)
        return redirect(url_for("chat")) 

@app.route(app_config.REDIRECT_PATH)
def auth_response():
    result = auth.complete_log_in(request.args)
    if "error" in result:
        return render_template("auth_error.html", result=result)
    global user_email
    user_email = result["preferred_username"]
    global user_name
    user_name = result["name"]
    print(result)
     # Check if the user's email exists in MongoDB
    existing_user = user_sessions_collection.find_one({'email': user_email})

    if existing_user:
        # User exists, perform actions or render template accordingly
        print( f'Welcome back, {user_name}!')
    else:
        # User doesn't exist, insert a new record
        user_sessions_collection.insert_one({'email': user_email, 'name': user_name, 'sessionsData': sessionData})
        print(f'New user added: {user_email}!')
    
    return redirect(url_for("index"))


@app.route("/logout")
def logout():
    return redirect(auth.log_out(url_for("index", _external=True)))

@app.route("/routToStandards", methods=["GET", "POST"])
def routToStandards():
    if not auth.get_user():
        return redirect(url_for("login"))
    # get data
    if auth.get_user():
        global user_name
        user_name = auth.get_user()["name"]
    if request.method == "POST":
        data = request.json.get('board','')
        global board_name
        board_name = data
        # return render_template("standards.html", version=identity.__version__, user_name=user_name)
        # update data
        # board_collection.update_one({}, {"$set": {"listed_boards": data}})
        return redirect(url_for("standards"))    

@app.route("/standards")
def standards():
    # Code to handle the /standards route, such as rendering a template
    return render_template("standards.html", version=identity.__version__, board_name=board_name, user_name=user_name)

@app.route("/getBoards")
def getBoards():
    result = board_collection.find_one({})
    if result and "listed_boards" in result:
        listed_boards = result["listed_boards"]
    return jsonify(listed_boards)

@app.route("/")
def index():
    if not (app.config["CLIENT_ID"] and app.config["CLIENT_SECRET"]):
        # This check is not strictly necessary.
        # You can remove this check from your production code.
        return render_template('config_error.html')
    if not auth.get_user():
        return redirect(url_for("login"))
    if auth.get_user():
        global user_name
        user_name = auth.get_user()["name"]
    return render_template('dashboard.html', user=auth.get_user(), version=identity.__version__, user_name=user_name)

@app.route("/subjects")
def subjects():
    return render_template("subjects.html", version=identity.__version__, board_name=board_name, user_name=user_name, board_val=board_val, board_subjects=board_subjects, grade_name=grade_data)
    
@app.route("/showSubjects", methods=["GET","POST"])
def show_subjects():
    if not auth.get_user():
        return jsonify({"error": "User not authenticated"})
    if auth.get_user():
        global user_name
        user_name = auth.get_user()["name"]
    if request.method == "POST":
        data = request.json.get('board','')
        global grade_name
        grade_name = request.json.get('grade_name','')
        collection_name = "boards_subjects"
        # Check if the collection exists
        if collection_name in db.list_collection_names():
            result = db[collection_name].find_one({"val": data})
            # print("Result:",len(result['val']))
            if result['val'] == data:
                global board_val, board_subjects
                board_val = result["val"]
                board_subjects = result["subjects"][grade_name]
                print("board_val:",board_val)
                print("board_subjects:",board_subjects)
        # global board_name
        # board_name = data
        # return render_template("standards.html", version=identity.__version__, user_name=user_name)
        # update data
        # board_collection.update_one({}, {"$set": {"listed_boards": data}})
        return jsonify({"success": True, "data": board_subjects})


@app.route("/getSubjects", methods=["GET","POST"])
def get_subjects():
    if not auth.get_user():
        return jsonify({"error": "User not authenticated"})
    if auth.get_user():
        global user_name
        user_name = auth.get_user()["name"]
    # Get the board and subject value from the request
    data = request.json.get('board','')
    global grade_data
    grade_data = request.json.get('grade_name','')
    print("gradeData",grade_data)
    # print("data:",len(data))
    # Assume you have collections named after each board (e.g., "karachi_board", "lahore_board")
    # Construct the collection name based on the received board value
    collection_name = "boards_subjects"
    # Check if the collection exists
    if collection_name in db.list_collection_names():
        result = db[collection_name].find_one({"val": data})
        # print("Result:",len(result['val']))
        if result['val'] == data:
            global board_val, board_subjects
            board_val = result["val"]
            board_subjects = result["subjects"][grade_data]
            print("board_val:",board_val)
            print("board_subjects:",board_subjects)
            # return render_template("subjects.html", val=result["val"], subjects=result["subjects"])
            return redirect(url_for("subjects")) 
        else:
            return jsonify({"error": "Invalid data structure in collection"})
    else:
        return jsonify({"error": "Collection not found"})
@app.route("/call_downstream_api")
def call_downstream_api():
    token = auth.get_token_for_user(app_config.SCOPE)
    if "error" in token:
        return redirect(url_for("login"))
    # Use access token to call downstream api
    api_result = requests.get(
        app_config.ENDPOINT,
        headers={'Authorization': 'Bearer ' + token['access_token']},
        timeout=30,
    ).json()
    return render_template('display.html', result=api_result)


if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)
