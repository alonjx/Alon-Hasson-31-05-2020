from flask import Flask, request, jsonify
import json
import time

webapp = Flask(__name__)

messages_db = {}


@webapp.route('/')
def nothing():
    return jsonify('nothing here')


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


