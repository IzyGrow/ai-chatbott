* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

body {
  background-color: #ffffff;
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Sidebar */
.sidebar {
  background-color: #f7f7f8;
  border-right: 1px solid #e5e5e5;
  width: 260px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
}

/* Main content */
.main-content {
  margin-left: 260px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Chat container */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 768px;
  margin: 0 auto;
  width: 100%;
}

/* Chat messages */
.chat-messages {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* Message bubbles */
.message-user {
  background-color: #f0f0f0;
  color: #333;
  border-radius: 18px 18px 4px 18px;
  padding: 12px 16px;
  max-width: 70%;
  margin-left: auto;
  margin-bottom: 16px;
  word-wrap: break-word;
}

.message-assistant {
  background-color: #ffffff;
  color: #333;
  border: 1px solid #e5e5e5;
  border-radius: 18px 18px 18px 4px;
  padding: 12px 16px;
  max-width: 70%;
  margin-right: auto;
  margin-bottom: 16px;
  word-wrap: break-word;
}

/* Input area */
.input-container {
  padding: 24px;
  background-color: #ffffff;
  border-top: 1px solid #e5e5e5;
}

.input-wrapper {
  position: relative;
  max-width: 768px;
  margin: 0 auto;
}

.chat-input {
  width: 100%;
  padding: 12px 48px 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 24px;
  font-size: 16px;
  outline: none;
  background-color: #ffffff;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: #10a37f;
}

.send-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #10a37f;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #0d8f6b;
}

.send-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

/* Welcome message */
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.welcome-title {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.welcome-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}

/* Loading animation */
.loading-dots {
  display: inline-block;
}

.loading-dots::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
}

/* Sidebar items */
.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  margin: 4px 12px;
  transition: background-color 0.2s;
}

.sidebar-item:hover {
  background-color: #e5e5e5;
}

.sidebar-item.active {
  background-color: #e5e5e5;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  
  .main-content {
    margin-left: 0;
  }
}
