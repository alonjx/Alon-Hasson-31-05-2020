from flask import Flask, request, jsonify, send_from_directory
import json
import time
import os

webapp = Flask(__name__, static_folder="../build", template_folder="../build")

messages_db = {}


# Serve React App
@webapp.route('/', defaults={'path': ''})
@webapp.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(webapp.static_folder + '/' + path):
        return send_from_directory(webapp.static_folder, path)
    else:
        return send_from_directory(webapp.static_folder, 'index.html')

@webapp.route('/messages', methods=['POST'])
def get_messages():
    global messages_db
    try:
        return jsonify(get_user_messages(request.form["user_id"]))
    except Exception as e:
        print("error: ", e)


@webapp.route('/send', methods=['POST'])
def send():
    global messages_db
    try:
        return send_message(request.form["sender"], request.form["receiver"], request.form["subject"], request.form["content"])
    except Exception as e:
        print("error: ", e)


@webapp.route('/delete', methods=['POST'])
def delete():
    global messages_db
    try:
        return delete_message(request.form["message_id"])
    except Exception as e:
        print("error: ", e)


def get_user_messages(user_id):
    global messages_db
    return {i: v for i, v in messages_db.items() if v["receiver"] == user_id or v["sender"] == user_id}


def send_message(sender, receiver, subject, content):
    message_id = max([int(i) for i in messages_db.keys()] + [0]) + 1
    messages_db[str(message_id)] = {
        "sender": sender,
        "receiver": receiver,
        "subject": subject,
        "content": content,
        "creation_date": time.ctime()
    }
    return json.dumps("done")


def delete_message(message_id):
    if message_id.isdigit():
        if message_id in messages_db.keys():
            messages_db.pop(message_id)
            return json.dumps("done")
        else:
            return json.dumps("Message not found")
    else:
        return json.dumps("No message id")


