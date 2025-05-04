import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { io } from 'socket.io-client';

const Chat = () => {
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageCaption, setImageCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const messagesEndRef = useRef(null);

    // Initialize socket connection
    useEffect(() => {
        console.log('Attempting to connect to socket server...');

        try {
            // Create a real socket.io connection
            const newSocket = io('http://localhost:4000');

            // Set up event handlers
            newSocket.on('connect', () => {
                console.log('Socket connected successfully!', newSocket.id);
                setConnectionStatus('connected');
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setConnectionStatus('error');
            });

            newSocket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                setConnectionStatus('disconnected');
            });

            setSocket(newSocket);

            // Clean up on unmount
            return () => {
                console.log('Cleaning up socket connection...');
                newSocket.disconnect();
            };
        } catch (error) {
            console.error('Error initializing socket:', error);
            setConnectionStatus('error');
        }
    }, []);

    // Load initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                console.log('Fetching messages from server...');
                const response = await axios.get('http://localhost:4000/message-api/all');

                if (response.data && Array.isArray(response.data)) {
                    setMessages(response.data);
                    console.log(`Fetched ${response.data.length} messages from server`);
                } else {
                    console.warn('Unexpected response format:', response.data);
                    setMessages([]);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                // If we can't fetch messages, start with an empty array
                setMessages([]);
            }
        };

        fetchMessages();
    }, []);

    // Listen for new messages
    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('newMessage');
        };
    }, [socket]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImageCaption(''); // Reset caption when new image is selected

            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle image upload
    const uploadImage = async () => {
        if (!selectedImage) return null;

        console.log('Uploading image to server...');

        try {
            const formData = new FormData();
            formData.append('messageImage', selectedImage);

            const response = await axios.post(
                'http://localhost:4000/message-api/upload-image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Image uploaded successfully:', response.data);
            return response.data.imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    // Send message
    const sendMessage = async (e) => {
        e.preventDefault();

        // Check if we have either text message or image (with optional caption)
        if ((!newMessage.trim() && !selectedImage) || loading) return;

        setLoading(true);

        try {
            let imageUrl = null;

            // Upload image if selected
            if (selectedImage) {
                imageUrl = await uploadImage();
            }

            // Determine content based on what's available
            let content = newMessage.trim();

            // If there's an image caption and no regular message, use the caption as content
            if (selectedImage && imageCaption.trim() && !content) {
                content = imageCaption.trim();
            }
            // If there's both a regular message and an image caption, combine them
            else if (selectedImage && imageCaption.trim() && content) {
                content = `${content}\n\nImage caption: ${imageCaption.trim()}`;
            }

            // Create message data
            const messageData = {
                content: content,
                sender: user.id || user.rollNumber,
                senderModel: 'Student',
                senderName: user.name,
                senderRollNumber: user.rollNumber,
                senderProfilePhoto: user.profilePhoto,
                isAdmin: false,
                image: imageUrl,
                room: 'community'
            };

            // Send message via socket
            if (socket) {
                socket.emit('sendMessage', messageData);
            }

            // Clear form
            setNewMessage('');
            setSelectedImage(null);
            setImagePreview(null);
            setImageCaption('');
            setShowEmojiPicker(false);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    // Cancel image selection
    const cancelImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setImageCaption('');
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerContainer}>
                <h2 style={styles.header}>Community Chat</h2>
                <div style={styles.statusContainer}>
                    <div style={{
                        ...styles.connectionStatus,
                        ...(connectionStatus === 'connected' ? styles.connected :
                            connectionStatus === 'error' ? styles.error : styles.disconnected)
                    }}>
                        {connectionStatus === 'connected' ? 'Connected' :
                         connectionStatus === 'error' ? 'Connection Error' : 'Disconnected'}
                    </div>
                    {(connectionStatus === 'error' || connectionStatus === 'disconnected') && (
                        <button
                            onClick={() => {
                                console.log('Manually reconnecting...');

                                // Disconnect existing socket if any
                                if (socket) {
                                    socket.disconnect();
                                }

                                // Create a new socket connection
                                try {
                                    const newSocket = io('http://localhost:4000');

                                    // Set up event handlers
                                    newSocket.on('connect', () => {
                                        console.log('Socket reconnected successfully!', newSocket.id);
                                        setConnectionStatus('connected');
                                    });

                                    newSocket.on('connect_error', (error) => {
                                        console.error('Socket reconnection error:', error);
                                        setConnectionStatus('error');
                                    });

                                    newSocket.on('disconnect', (reason) => {
                                        console.log('Socket disconnected:', reason);
                                        setConnectionStatus('disconnected');
                                    });

                                    // Listen for new messages
                                    newSocket.on('newMessage', (message) => {
                                        setMessages((prevMessages) => [...prevMessages, message]);
                                    });

                                    setSocket(newSocket);

                                    // Fetch messages after reconnecting
                                    const fetchMessages = async () => {
                                        try {
                                            console.log('Fetching messages after reconnection...');
                                            const response = await axios.get('http://localhost:4000/message-api/all');

                                            if (response.data && Array.isArray(response.data)) {
                                                setMessages(response.data);
                                                console.log(`Fetched ${response.data.length} messages after reconnection`);
                                            }
                                        } catch (error) {
                                            console.error('Error fetching messages after reconnection:', error);
                                        }
                                    };

                                    fetchMessages();
                                } catch (error) {
                                    console.error('Error reconnecting socket:', error);
                                    setConnectionStatus('error');
                                }
                            }}
                            style={styles.retryButton}
                        >
                            Retry Connection
                        </button>
                    )}
                </div>
            </div>

            {/* Messages container */}
            <div style={styles.messagesContainer}>
                {connectionStatus === 'error' ? (
                    <div style={styles.connectionError}>
                        <p>Unable to connect to the chat server. Please check if the server is running and try again.</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div style={styles.emptyMessages}>
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={message._id || index}
                            style={{
                                ...styles.messageItem,
                                ...(message.isAdmin ? styles.adminMessage : {}),
                                ...(message.senderRollNumber === user.rollNumber ? styles.ownMessage : {})
                            }}
                        >
                            <div style={styles.messageHeader}>
                                {message.senderProfilePhoto ? (
                                    <img
                                        src={message.senderProfilePhoto}
                                        alt={message.senderName}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <div style={{
                                        ...styles.profilePlaceholder,
                                        ...(message.isAdmin ? styles.adminProfilePlaceholder : {})
                                    }}>
                                        {message.senderName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <div style={styles.senderName}>
                                        {message.senderName}
                                        {message.isAdmin && (
                                            <span style={styles.adminBadge}>Admin</span>
                                        )}
                                    </div>
                                    <div style={styles.timestamp}>
                                        {new Date(message.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div style={styles.messageContent}>
                                {message.content && (
                                    <div style={styles.messageText}>
                                        {message.content.split('\n').map((text, i) => (
                                            <React.Fragment key={i}>
                                                {text}
                                                {i < message.content.split('\n').length - 1 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}

                                {message.image && (
                                    <div style={styles.imageContainer}>
                                        <img
                                            src={message.image}
                                            alt="Message attachment"
                                            style={styles.messageImage}
                                            onClick={() => window.open(message.image, '_blank')}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input form */}
            <form onSubmit={sendMessage} style={styles.inputContainer}>
                {imagePreview && (
                    <div style={styles.previewContainer}>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={styles.previewImage}
                        />
                        <button
                            type="button"
                            onClick={cancelImage}
                            style={styles.cancelButton}
                        >
                            ×
                        </button>

                        {/* Image caption input */}
                        <input
                            type="text"
                            value={imageCaption}
                            onChange={(e) => setImageCaption(e.target.value)}
                            placeholder="Add a caption to this image..."
                            style={styles.captionInput}
                            disabled={loading || connectionStatus !== 'connected'}
                        />
                    </div>
                )}

                <div style={styles.inputWrapper}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={connectionStatus !== 'connected' ? "Chat unavailable - Server connection issue" : "Type a message..."}
                        style={{
                            ...styles.textInput,
                            ...(connectionStatus !== 'connected' ? styles.disabledInput : {})
                        }}
                        disabled={loading || connectionStatus !== 'connected'}
                    />

                    <div style={styles.actionButtons}>
                        <label
                            htmlFor="image-upload"
                            style={{
                                ...styles.imageButton,
                                ...(connectionStatus !== 'connected' ? styles.disabledButton : {})
                            }}
                            title="Attach image"
                        >
                            <span role="img" aria-label="Attach image">📎</span>
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={styles.hiddenInput}
                            disabled={loading || connectionStatus !== 'connected'}
                        />

                        <button
                            type="submit"
                            style={{
                                ...styles.sendButton,
                                ...((!newMessage.trim() && !selectedImage) || loading || connectionStatus !== 'connected' ? styles.disabledButton : {})
                            }}
                            disabled={(!newMessage.trim() && !selectedImage) || loading || connectionStatus !== 'connected'}
                        >
                            {loading ? (
                                <span style={styles.loadingText}>Sending...</span>
                            ) : (
                                <span>Send</span>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '85vh',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '1rem',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '0.75rem',
        borderBottom: '1px solid #eee',
    },
    header: {
        color: '#0D6EFD',
        fontWeight: 'bold',
        margin: 0,
    },
    connectionStatus: {
        padding: '0.3rem 0.6rem',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    connected: {
        backgroundColor: '#4CAF50',
        color: 'white',
    },
    disconnected: {
        backgroundColor: '#9E9E9E',
        color: 'white',
    },
    error: {
        backgroundColor: '#F44336',
        color: 'white',
    },
    statusContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.5rem',
    },
    retryButton: {
        padding: '0.3rem 0.6rem',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    messagesContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    emptyMessages: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: '#888',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    connectionError: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: '#F44336',
        fontStyle: 'italic',
        textAlign: 'center',
        backgroundColor: '#FFEBEE',
        padding: '1rem',
        borderRadius: '8px',
    },
    messageItem: {
        padding: '0.75rem',
        borderRadius: '12px',
        backgroundColor: '#f5f5f5',
        maxWidth: '80%',
        alignSelf: 'flex-start',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
    },
    adminMessage: {
        backgroundColor: '#e3f2fd',
        borderLeft: '4px solid #2196f3',
    },
    ownMessage: {
        backgroundColor: '#e8f5e9',
        alignSelf: 'flex-end',
        borderRight: '4px solid #4CAF50',
    },
    messageHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.5rem',
    },
    profileImage: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        marginRight: '0.75rem',
        objectFit: 'cover',
        border: '2px solid #fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    profilePlaceholder: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#0D6EFD',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '0.75rem',
        fontSize: '1rem',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    adminProfilePlaceholder: {
        backgroundColor: '#2196f3',
    },
    senderName: {
        fontWeight: 'bold',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
    },
    adminBadge: {
        backgroundColor: '#2196f3',
        color: 'white',
        fontSize: '0.7rem',
        padding: '0.1rem 0.4rem',
        borderRadius: '4px',
        marginLeft: '0.5rem',
        fontWeight: 'bold',
    },
    timestamp: {
        fontSize: '0.7rem',
        color: '#666',
        marginTop: '0.1rem',
    },
    messageContent: {
        marginLeft: '2.75rem',
    },
    messageText: {
        margin: '0',
        wordBreak: 'break-word',
        lineHeight: '1.4',
    },
    imageContainer: {
        marginTop: '0.5rem',
        position: 'relative',
    },
    messageImage: {
        maxWidth: '100%',
        maxHeight: '250px',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease',
        ':hover': {
            transform: 'scale(1.02)',
        }
    },
    inputContainer: {
        marginTop: '1rem',
        borderTop: '1px solid #eee',
        paddingTop: '1rem',
    },
    previewContainer: {
        position: 'relative',
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: '#f9f9f9',
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px dashed #ddd',
    },
    previewImage: {
        maxHeight: '150px',
        maxWidth: '100%',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    },
    captionInput: {
        width: '100%',
        marginTop: '0.75rem',
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '0.9rem',
    },
    cancelButton: {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#ff5252',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        padding: '0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    textInput: {
        flex: 1,
        padding: '0.85rem',
        borderRadius: '24px',
        border: '1px solid #ddd',
        outline: 'none',
        fontSize: '1rem',
        transition: 'border-color 0.2s ease',
        ':focus': {
            borderColor: '#0D6EFD',
        }
    },
    actionButtons: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    imageButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        backgroundColor: '#f0f0f0',
        cursor: 'pointer',
        fontSize: '1.2rem',
        transition: 'background-color 0.2s ease',
        ':hover': {
            backgroundColor: '#e0e0e0',
        }
    },
    hiddenInput: {
        display: 'none',
    },
    sendButton: {
        padding: '0.85rem 1.5rem',
        borderRadius: '24px',
        backgroundColor: '#0D6EFD',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '80px',
    },
    disabledButton: {
        backgroundColor: '#b0c4de',
        cursor: 'not-allowed',
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#999',
        cursor: 'not-allowed',
    },
    loadingText: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
    },
};

export default Chat;
