# Jar-messaging-webapp
Voice &amp; Text Message Platform
Project Title:  Jar – Voice & Text Message Platform

The Daily Message Generator is a simple, heartwarming web application that enables two types of users—Imputers (e.g., parents) and Receivers (e.g., children)—to exchange daily motivational messages. Messages can be in the form of text and/or voice notes.
It’s designed to strengthen connections through personalized messages sent and received within a lightweight HTML/CSS/JavaScript interface.

## Features

-   Role-based sign-up: Choose to be a Sender or Receiver
-   Send text messages instantly
-   Record and send voice notes
-   Receivers view messages live
-   Option to save and delete messages
-   Secure login system using `local Storage`

## User Flow

1. Sender (Imputer):
- Sign up with your name and email
- Add receiver(s) by their email address
- Send messages (text or voice)
- Messages are delivered instantly to receivers

2.  Receiver:
- Log in with your email
- See the latest message from your connected sender
- Save important messages for later
- Delete messages as needed

##  Project Structure

```plaintext
├── index.html
├── login.html
├── signup.html
├── imputer.html          # Sender dashboard
├── receiver.html         # Receiver dashboard
├── style.css
├── scripts/
│   ├── auth.js
│   ├── imputer.js
│   ├── receiver.js
│   └── recorder.js

## Technologies Used
-  HTML / CSS / JavaScript
-  Web Audio API for recording
-  local Storage for session and message management

## How It Works
- Imputer enters receiver's name, writes a motivational text message, or records a voice message.
- Messages are saved in local Storage using the format:
Text: text_receiverName
Audio: audio_receiverName
- Receiver logs in with their name, and the app fetches today's message based on the date.
- If a message exists for the day, it's displayed or played using the HTML <audio> tag.

## Future Enhancements
- Firebase or MongoDB integration for cloud storage.
- Push notifications for new messages.
- Download option for saved audio messages.
- Dark mode UI.

## Acknowledgements
This project was designed as a lightweight messaging platform to facilitate meaningful communication between two parties in environments with restricted or limited means of interaction — such as between parents and children, mentors and mentees, or prisoners and their legal representatives. 


