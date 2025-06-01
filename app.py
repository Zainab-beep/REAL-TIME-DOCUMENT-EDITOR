from flask import Flask
from flask_socketio import SocketIO, emit, join_room
from pymongo import MongoClient
from bson.objectid import ObjectId
import eventlet

eventlet.monkey_patch()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['collab']
documents = db['documents']

def get_or_create_document(doc_id):
    try:
        _id = ObjectId(doc_id)
    except:
        return None
    doc = documents.find_one({'_id': _id})
    if not doc:
        documents.insert_one({'_id': _id, 'content': ''})
        doc = documents.find_one({'_id': _id})
    return doc

@socketio.on('get-document')
def on_get_document(doc_id):
    doc = get_or_create_document(doc_id)
    if doc:
        join_room(doc_id)
        emit('load-document', doc['content'])

@socketio.on('send-changes')
def on_send_changes(data):
    doc_id = data['docId']
    delta = data['delta']
    emit('receive-changes', delta, room=doc_id, include_self=False)

@socketio.on('save-document')
def on_save_document(data):
    doc_id = data['docId']
    content = data['content']
    documents.update_one({'_id': ObjectId(doc_id)}, {'$set': {'content': content}})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)