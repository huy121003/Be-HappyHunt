import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Messages = ({ chatId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Connect to the messages namespace
    const messagesSocket = io('http://your-backend-url/messages');
    setSocket(messagesSocket);

    return () => {
      messagesSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Join message room
    socket.emit('join_message_room', chatId);

    // Listen for message history
    socket.on('message_history', (data) => {
      setMessages((prev) => [...prev, ...data.items]);
      setHasMore(data.items.length === data.size);
    });

    // Listen for message status changes
    socket.on('message_status_changed', ({ messageId, status, updatedAt }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status, updatedAt } : msg
        )
      );
    });

    // Fetch initial messages
    fetchMessages();

    return () => {
      socket.emit('leave_message_room', chatId);
      socket.off('message_history');
      socket.off('message_status_changed');
    };
  }, [socket, chatId]);

  const fetchMessages = () => {
    socket.emit('fetch_messages', {
      chatId,
      page,
      size: 20,
    });
  };

  const loadMoreMessages = () => {
    if (!hasMore) return;
    setPage((prev) => prev + 1);
    fetchMessages();
  };

  const markMessageAsRead = (messageId) => {
    socket.emit('update_message_status', {
      messageId,
      chatId,
      status: 'READ',
    });
  };

  return (
    <div className="messages-container">
      {hasMore && (
        <button onClick={loadMoreMessages} className="load-more">
          Load More Messages
        </button>
      )}

      <div className="messages-list">
        {messages.map((message) => (
          <div key={message._id} className="message-item">
            <p>{message.message}</p>
            <span className="status">{message.status}</span>
            {message.status !== 'READ' && (
              <button onClick={() => markMessageAsRead(message._id)}>
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
