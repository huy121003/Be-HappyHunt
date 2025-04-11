import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Chat = ({ userId, username }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());

  useEffect(() => {
    // Connect to the chat namespace
    const chatSocket = io('http://your-backend-url/chat');
    setSocket(chatSocket);

    // Cleanup on component unmount
    return () => {
      chatSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    socket.on('receive_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // Listen for typing status
    socket.on('user_typing', ({ userId, username }) => {
      setTypingUsers((prev) => new Set(prev).add(username));
    });

    socket.on('user_stop_typing', ({ userId }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(username);
        return newSet;
      });
    });

    // Listen for message status updates
    socket.on('message_status_updated', ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg))
      );
    });

    // Join a chat room
    socket.emit('join_chat', 'chat-slug-here');

    return () => {
      socket.emit('leave_chat', 'chat-slug-here');
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
      socket.off('message_status_updated');
    };
  }, [socket]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit('send_message', {
      chatId: 'chat-id-here',
      chatSlug: 'chat-slug-here',
      senderId: userId,
      sender: { _id: userId, username },
      message: message,
    });

    setMessage('');
  };

  const handleTyping = () => {
    socket.emit('typing', {
      chatSlug: 'chat-slug-here',
      userId,
      username,
    });

    // Stop typing after 2 seconds of inactivity
    setTimeout(() => {
      socket.emit('stop_typing', {
        chatSlug: 'chat-slug-here',
        userId,
      });
    }, 2000);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender._id === userId ? 'sent' : 'received'}`}
          >
            <span className="username">{msg.sender.username}</span>
            <p>{msg.message}</p>
            <span className="status">{msg.status}</span>
          </div>
        ))}
      </div>

      {typingUsers.size > 0 && (
        <div className="typing-indicator">
          {Array.from(typingUsers).join(', ')} is typing...
        </div>
      )}

      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleTyping}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
