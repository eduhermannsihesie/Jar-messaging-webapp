// // Run the code only after the DOM has fully loaded
// document.addEventListener('DOMContentLoaded', () => {

//   // Grab references to important DOM elements
//   const displayBox = document.getElementById('message-box');           // Where the latest message will be shown
//   const saveBtn = document.getElementById('save-btn');                 // Save button
//   const deleteBtn = document.getElementById('delete-btn');             // Delete button
//   const viewAllBtn = document.getElementById('view-all-btn');          // View all messages button
//   const allMessagesSection = document.getElementById('all-messages');  // Section to show saved messages
//   const messageList = document.getElementById('message-list');         // Container to list saved messages

//   // Retrieve messages from localStorage, or use an empty array if none exist
//   let messages = JSON.parse(localStorage.getItem('messages')) || [];

//   // Function to display the latest message (text or audio)
//   function renderLatestMessage() {
//     // If there are no messages, show placeholder and disable buttons
//     if (messages.length === 0) {
//       displayBox.innerHTML = '<p>No message yet.</p>';
//       saveBtn.disabled = true;
//       deleteBtn.disabled = true;
//       return;
//     }

//     // Get the latest message (last in array)
//     const latest = messages[messages.length - 1];

//     // Display based on type (text or audio)
//     if (latest.type === 'text') {
//       displayBox.innerHTML = `<p>“${latest.content}”</p>`;
//     } else if (latest.type === 'audio') {
//       displayBox.innerHTML = `<audio controls src="${latest.content}"></audio>`;
//     }

//     // Disable save button if message is already saved
//     saveBtn.disabled = !!latest.saved;
//   }

//   // Function to mark the latest message as saved
//   function saveMessage() {
//     if (messages.length === 0) return;

//     // Mark the last message as saved
//     messages[messages.length - 1].saved = true;

//     // Save updated array back to localStorage
//     localStorage.setItem('messages', JSON.stringify(messages));

//     // Disable save button since it's saved now
//     saveBtn.disabled = true;

//     alert('Message saved!');
//   }

//   // Function to delete the latest message
//   function deleteMessage() {
//     if (messages.length === 0) return;

//     // Remove the last message in the array
//     messages.pop();

//     // Save the updated messages array
//     localStorage.setItem('messages', JSON.stringify(messages));

//     // Re-render the new latest message
//     renderLatestMessage();
//   }

// //   // Function to display all saved messages
// //   function renderAllMessages() {
// //     // Toggle visibility of the saved messages section
// //     allMessagesSection.classList.toggle('hidden');

// //     // Clear the previous list
// //     messageList.innerHTML = '';

// //     // Filter only messages that have been saved
// //     const savedMessages = messages.filter(msg => msg.saved);

// //     // If none saved, show placeholder
// //     if (savedMessages.length === 0) {
// //       messageList.innerHTML = '<p>No saved messages yet.</p>';
// //       return;
// //     }

// //     // Reverse so most recent saved messages appear on top
// //     savedMessages.slice().reverse().forEach((msg, index) => {
// //       const div = document.createElement('div');
// //       div.classList.add('message-item');

// //       // Display either text or audio
// //       const content = msg.type === 'text'
// //         ? `<p>“${msg.content}”</p>`
// //         : `<audio controls src="${msg.content}"></audio>`;

// //       div.innerHTML = content;

// //       // Add this message to the list
// //       messageList.appendChild(div);
// //     });
// //   }


// function renderAllMessages() {
//   const isHidden = allMessagesSection.classList.toggle('hidden');

//   // Update button text based on visibility
//   viewAllBtn.textContent = isHidden ? 'View All' : 'Collapse';

//   messageList.innerHTML = '';

//   // Filter only saved messages
//   const savedMessages = messages.filter(msg => msg.saved);

//   if (savedMessages.length === 0) {
//     messageList.innerHTML = '<p>No saved messages yet.</p>';
//     return;
//   }

//   // Display each saved message (newest first)
//   savedMessages.slice().reverse().forEach((msg) => {
//     const div = document.createElement('div');
//     div.classList.add('message-item');

//     const content = msg.type === 'text'
//       ? `<p>“${msg.content}”</p>`
//       : `<audio controls src="${msg.content}"></audio>`;

//     div.innerHTML = content;
//     messageList.appendChild(div);
//   });
// }


//   // Attach event listeners to buttons
//   saveBtn.addEventListener('click', saveMessage);
//   deleteBtn.addEventListener('click', deleteMessage);
//   viewAllBtn.addEventListener('click', renderAllMessages);

//   // Show the first message when the page loads
//   renderLatestMessage();
// });



// document.addEventListener('DOMContentLoaded', () => {
//   const logoutBtn = document.getElementById('logout-btn');

//   if (logoutBtn) {
//     logoutBtn.addEventListener('click', (e) => {
//       e.preventDefault();
//       localStorage.removeItem('loggedInUser'); // Clear logged-in user
//       window.location.href = '/Pages/login.html'; // Redirect to login page
//     });
//   }
// });

// logoutBtn.addEventListener('click', (e) => {
//   e.preventDefault();
//   const confirmLogout = confirm("Are you sure you want to log out?");
//   if (confirmLogout) {
//     localStorage.removeItem('loggedInUser');
//     window.location.href = '/Pages/login.html';
//   }
// });

// Receiver Page Script

// On DOM load
window.addEventListener('DOMContentLoaded', () => {
  const displayBox = document.getElementById('message-box');
  const saveBtn = document.getElementById('save-btn');
  const deleteBtn = document.getElementById('delete-btn');
  const viewAllBtn = document.getElementById('view-all-btn');
  const allMessagesSection = document.getElementById('all-messages');
  const messageList = document.getElementById('message-list');

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!loggedInUser || loggedInUser.role !== 'Receiver') {
    window.location.href = '/Pages/login.html';
    return;
  }

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


const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem('loggedInUser'); // Clear the session
      window.location.href = '/Pages/login.html'; // Redirect to login
    }
  });
}



