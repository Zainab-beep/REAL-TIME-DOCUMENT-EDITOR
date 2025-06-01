import React, { useEffect, useRef, useState } from 'react';
import Quill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { io } from 'socket.io-client';

const SAVE_INTERVAL_MS = 2000;
const DOCUMENT_ID = "666000000000000000000001"; // Make sure this ObjectId exists in MongoDB or gets created by Flask

const Editor = () => {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const wrapperRef = useRef(null);

  // Connect to backend socket
  useEffect(() => {
    const s = io("http://localhost:5000");
    setSocket(s);
    return () => s.disconnect();
  }, []);

  // Load document
  useEffect(() => {
    if (!socket || !quill) return;

    socket.once('load-document', document => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit('get-document', DOCUMENT_ID);
  }, [socket, quill]);

  // Send changes
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit('send-changes', { delta, docId: DOCUMENT_ID });
    };

    quill.on('text-change', handler);
    return () => quill.off('text-change', handler);
  }, [socket, quill]);

  // Receive changes
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = delta => {
      quill.updateContents(delta);
    };

    socket.on('receive-changes', handler);
    return () => socket.off('receive-changes', handler);
  }, [socket, quill]);

  // Auto-save every 2 seconds
  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit('save-document', {
        docId: DOCUMENT_ID,
        content: quill.getContents()
      });
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [socket, quill]);

  // Initialize Quill
  useEffect(() => {
    const editor = document.createElement("div");
    wrapperRef.current.append(editor);

    const q = new Quill(editor, { theme: "snow" });
    q.disable();
    q.setText("Loading...");
    setQuill(q);

    return () => {
      wrapperRef.current.innerHTML = "";
    };
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default Editor;