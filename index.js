//  ----------Check Logged-In User and Display Name------------
document.addEventListener('DOMContentLoaded', () => {
  const userData = JSON.parse(localStorage.getItem('loggedInUser')); // Get logged-in user's data from localStorage

  if (!userData) {
    window.location.href = '/login.html'; // Redirect to login if not logged in
    return;
  }

  const logoutBtn = document.getElementById('logout-btn');

  // If logout button exists, add click handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedInUser'); // Clear session
      window.location.href = '/login.html'; // Redirect to login
    });
  }

  // Capitalize first letter of name
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Display user's name in the UI
  const nameDisplay = document.getElementById('user-name');
  if (nameDisplay) {
    nameDisplay.textContent = capitalize(userData.name);
  }
});

 



 

// -----------Submit a Text Message--------------
function submitMessage() {
  const textarea = document.getElementById('thoughts'); // Get textarea input
  const message = textarea.value.trim(); // Trim spaces
  if (!message) return;

  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const receivers = user.receivers || []; // Get list of receivers (from sender account)

  const newMsg = {
    type: 'text',
    content: message,
    sender: user.email,
    receivers: receivers,
    timestamp: new Date().toISOString(),
  };

  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages.push(newMsg); // Add message to array
  localStorage.setItem('messages', JSON.stringify(messages)); // Save updated messages

  textarea.value = ''; // Clear input
  displayMessages(); // Re-render message list
}





// Allow sending message with Enter key
//  --------------Allow Submit on Enter Key (No Shift)----------
document.getElementById('thoughts').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault(); // Prevent new line
    submitMessage();    // Trigger send
  }
});


//  -----------Display Messages (Text + Audio)--------------

function displayMessages(showAll = false) {
  // Get the container where messages will be displayed
  const container = document.querySelector('.sent-msg-container');
  container.innerHTML = ''; // Clear any previously displayed messages

  // Get the currently logged-in user's info from localStorage
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  // Get all saved messages from localStorage or use an empty array if none
  const allMessages = JSON.parse(localStorage.getItem('messages')) || [];

  // 🔒 Filter messages so only the ones sent by the currently logged-in user are shown
  const userMessages = allMessages.filter(msg => msg.sender === user.email);

  // Reverse the order of messages so the newest ones appear first
  const sortedMessages = [...userMessages].reverse();

  // If 'showAll' is true, display all messages; otherwise, only show the latest 3
  const messagesToShow = showAll ? sortedMessages : sortedMessages.slice(0, 3);

  // Loop through the messages to display each one
  messagesToShow.forEach((msg, displayIndex) => {
    // Find the original index of the message in the full message list
    // This helps us delete the correct message later
    const originalIndex = allMessages.findIndex(m =>
      m.sender === msg.sender &&
      m.content === msg.content &&
      m.timestamp === msg.timestamp
    );

    // Create a new <div> to hold the individual message
    const div = document.createElement('div');
    div.classList.add('sent-msg'); // Add class for styling

    let contentHTML = ''; // Will hold the actual message content

    // If the message is a text type, wrap the text in a <p> tag
    if (msg.type === 'text') {
      contentHTML = `<p>“${msg.content}”</p>`;
    } 
    // If it's an audio type, create an audio player
    else if (msg.type === 'audio') {
      contentHTML = `
        <div class="custom-audio">
          <audio controls src="${msg.content}"></audio>
        </div>`;
    }

    // Set the inner HTML of the div to include the message and delete button
    div.innerHTML = `
      ${contentHTML}
      <button class="delete-btn" data-index="${originalIndex}" style="...">🗑️</button>
    `;

    // Add the message div to the container in the DOM
    container.appendChild(div);
  });

  // Add click event listeners to all delete buttons that were just rendered
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Get the index of the message to delete (from the data-index attribute)
      const index = parseInt(e.target.getAttribute('data-index'));
      // Call the delete function to remove the message
      deleteMessage(index);
    });
  });
}



//  ------------Delete Message Function----------
function deleteMessage(index) {
  let messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages.splice(index, 1); // Remove one message at index
  localStorage.setItem('messages', JSON.stringify(messages));
  displayMessages(showingAll); // Re-render list
}



// --------Toggle View More / Less Messages----------
let showingAll = false; // Track state of message display

document.addEventListener('DOMContentLoaded', () => {
  displayMessages(false); // Show 3 messages initially

  const toggleBtn = document.getElementById('toggle-view-btn');
  toggleBtn.addEventListener('click', () => {
    showingAll = !showingAll;
    displayMessages(showingAll);
    toggleBtn.textContent = showingAll ? 'Collapse' : 'View All'; // Update button text
  });
});

// -------------Save Audio Message Function----------
// This function saves the audio message as a Base64 string in localStorage
function saveAudioMessage(blob) {
  const reader = new FileReader();

  reader.onloadend = () => {
    const base64Audio = reader.result;

    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const receivers = user.receivers || [];

    const newMsg = {
      type: 'audio',
      content: base64Audio,
      sender: user.email,
      // ❌ if receivers is missing, receivers can't see the message
      receivers: receivers, // ✅ this must be included
      timestamp: new Date().toISOString(),
    };

    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push(newMsg);
    localStorage.setItem('messages', JSON.stringify(messages));

    displayMessages(); // Refresh sender UI
  };

  reader.readAsDataURL(blob);
}







//  ---------Audio Recording Setup------------
let mediaRecorder;
let audioChunks = [];

// Show recording popup
document.getElementById('mic').addEventListener('click', () => {
  document.getElementById('recorder-popup').classList.remove('is-hidden');
});

// Start recording
document.getElementById('start-recording').addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
    audioChunks = []; // reset
    saveAudioMessage(audioBlob); // Save audio
  };

  mediaRecorder.start(); // Start recording
});

// Stop recording
document.getElementById('stop-recording').addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop(); // Will trigger onstop
  }

  // 🔽 Hide the popup after recording stops
  document.getElementById('recorder-popup').classList.add('is-hidden');
});






// Hide popup after sending
document.getElementById('send-audio').addEventListener('click', () => {
  document.getElementById('recorder-popup').classList.add('is-hidden');
});

// Cancel popup and reset
document.getElementById('close-popup').addEventListener('click', () => {
  document.getElementById('recorder-popup').classList.add('is-hidden');
  audioChunks = []; // Clear temp data
});





// --------Logout Confirmation (Redundant Block)---------------
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const confirmLogout = confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        localStorage.removeItem('loggedInUser');
        window.location.href = '/login.html'; // Redirect to home page
      }
    });
  }
});





 