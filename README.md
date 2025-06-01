COMPANY: CODTECH IT SOLUTIONS

NAME: ZAINAB UNISA NAAZNEEN

INTERN ID: CT04DM194

DOMAIN: FULL STACK WEB DEVELOPMENT

DURATION: 4 WEEKS

MENTOR: NEELA SANTOSH

This is a full-stack real-time collaborative document editing web application, similar to Google Docs. It enables multiple users to work on the same document simultaneously with changes reflected in real-time. 
The project is built with React.js on the frontend and Flask (with Flask-SocketIO) on the backend.
MongoDB is used to persist document data.

 Features:
Real-time document editing using WebSockets
Multiple users can collaborate on a single document
Document content saved periodically to MongoDB
Rich text editor powered by React Quill
Clean, responsive user interface
Auto-join document by unique document ID in URL

 Tech Stack:
Frontend:
React.js
React-Quill (for text editing)
Socket.IO client

Backend:
Flask
Flask-SocketIO
Eventlet
PyMongo
Database:
MongoDB (local or Atlas)

📁 Project Structure

document-editor/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   └── src/
│       ├── App.js
│       └── editor.js

 Installation
Backend (Python + Flask)
1. Navigate to the backend directory:
cd backend
2. Create a virtual environment (optional but recommended):
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
3. Install dependencies:
pip install -r requirements.txt
4. Run the server:
python app.py
Make sure MongoDB is running on your machine (mongodb://localhost:27017/ by default).

Frontend (React)
1. Navigate to the frontend directory:
cd frontend
2. Install frontend dependencies:
npm install
3. Start the development server:
npm start
The frontend will be running at http://localhost:3000 and will communicate with the Flask backend on port 5000.

 How It Works:
When a user navigates to a document URL (/document/:id), the frontend emits a get-document event.
The backend checks if the document exists. If not, it creates a new one.
As the user types, changes are broadcast to other users in the same room via send-changes events.
Every few seconds or on manual trigger, the document is saved in MongoDB.

OUTPUT
![Image](https://github.com/user-attachments/assets/bd10d221-77d8-4615-9977-83ff52bae605)
