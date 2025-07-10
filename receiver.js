// File: receiver.js
// This file handles the receiver's interface, displaying the latest message, allowing saving and deleting messages
window.addEventListener('DOMContentLoaded', () => {
  const displayBox = document.getElementById('message-box');
  const saveBtn = document.getElementById('save-btn');
  const deleteBtn = document.getElementById('delete-btn');
  const viewAllBtn = document.getElementById('view-all-btn');
  const allMessagesSection = document.getElementById('all-messages');
  const messageList = document.getElementById('message-list');

  // Check if user is logged in and has the Receiver role
  // If not, redirect to login page
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!loggedInUser || loggedInUser.role !== 'Receiver') {
    window.location.href = '/login.html';
    return;
  }

  // Display user's name in the UI
  const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login.html';
  });
}



  // Get all messages from localStorage
  // If no messages exist, initialize an empty array
  let allMessages = JSON.parse(localStorage.getItem('messages')) || [];

  // Filter messages for this receiver only
  let receiverMessages = allMessages.filter(
    (msg) => msg.receivers && msg.receivers.includes(loggedInUser.email)
  );

  function renderLatestMessage() {
    if (receiverMessages.length === 0) {
      displayBox.innerHTML = '<p>No message yet.</p>';
      saveBtn.disabled = true;
      deleteBtn.disabled = true;
      return;
    }

    const latest = receiverMessages[receiverMessages.length - 1];

    if (latest.type === 'text') {
      displayBox.innerHTML = `<p>“${latest.content}”</p>`;
    } else if (latest.type === 'audio') {
      displayBox.innerHTML = `<audio controls src="${latest.content}"></audio>`;
    }

    saveBtn.disabled = !!latest.saved;
  }

  function saveMessage() {
    if (receiverMessages.length === 0) return;
    const latestMsg = receiverMessages[receiverMessages.length - 1];
    latestMsg.saved = true;

    const index = allMessages.findIndex(m => m.timestamp === latestMsg.timestamp);
    if (index !== -1) {
      allMessages[index].saved = true;
      localStorage.setItem('messages', JSON.stringify(allMessages));
    }

    saveBtn.disabled = true;
    alert('Message saved!');
  }

  function deleteMessage() {
    if (receiverMessages.length === 0) return;
    const latestMsg = receiverMessages.pop();

    // Remove from full message array
    allMessages = allMessages.filter(m => m.timestamp !== latestMsg.timestamp);
    localStorage.setItem('messages', JSON.stringify(allMessages));

    renderLatestMessage();
  }

  function renderAllMessages() {
    allMessagesSection.classList.toggle('hidden');
    messageList.innerHTML = '';

    const savedMessages = receiverMessages.filter(m => m.saved);

    savedMessages.slice().reverse().forEach((msg) => {
      const div = document.createElement('div');
      div.classList.add('message-item');

      const content = msg.type === 'text'
        ? `<p>“${msg.content}”</p>`
        : `<audio controls src="${msg.content}"></audio>`;

      div.innerHTML = `
        ${content}
        <button class="delete-btn" data-id="${msg.timestamp}">🗑️</button>
      `;

      messageList.appendChild(div);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const timestamp = btn.dataset.id;
        allMessages = allMessages.filter(m => m.timestamp !== timestamp);
        localStorage.setItem('messages', JSON.stringify(allMessages));

        receiverMessages = allMessages.filter(
          m => m.receivers && m.receivers.includes(loggedInUser.email)
        );

        renderAllMessages();
        renderLatestMessage();
      });
    });

    // Toggle button text
    viewAllBtn.textContent = allMessagesSection.classList.contains('hidden') ? 'View All' : 'Collapse';
  }

  // Bind events
  saveBtn.addEventListener('click', saveMessage);
  deleteBtn.addEventListener('click', deleteMessage);
  viewAllBtn.addEventListener('click', renderAllMessages);

  renderLatestMessage();
});


