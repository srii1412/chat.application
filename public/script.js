const socket = io();

// Elements
const usernameInput = document.getElementById('username');
const registerBtn = document.getElementById('registerBtn');
const recipientInput = document.getElementById('recipient');
const inputMessage = document.getElementById('inputMessage');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const messagesList = document.getElementById('messages');
const registerContainer = document.getElementById('register-container');
const chatContainer = document.getElementById('chat-container');

// Register user
registerBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit('register', username); // Notify the server
    registerContainer.style.display = 'none';
    chatContainer.style.display = 'block';
  }
});

// Send private message
sendMessageBtn.addEventListener('click', () => {
  const recipient = recipientInput.value.trim();
  const message = inputMessage.value.trim();
  if (recipient && message) {
    socket.emit('private message', { to: recipient, message });
    displayMessage(`You (to ${recipient}): ${message}`);
    inputMessage.value = ''; // Clear input field
  }
});

// Receive private message
socket.on('private message', ({ from, message }) => {
  displayMessage(`${from}: ${message}`);
});

// Display messages
function displayMessage(msg) {
  const li = document.createElement('li');
  li.textContent = msg;
  messagesList.appendChild(li);
}

// Handle errors
socket.on('error', (errorMessage) => {
  alert(errorMessage);
});
