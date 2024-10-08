# Ringer

Ringer is a feature-rich social media platform designed to offer users a seamless and interactive experience. The platform allows users to create accounts, share media, interact with posts, and connect with others through following and chat functionalities.

## Features

- **User Authentication**: Users can sign up, log in, and manage their accounts.
- **Post Creation**: Users can create posts with text and media (images, videos).
- **Follow System**: Follow other users to stay updated with their latest posts.
- **Likes & Comments**: Engage with posts by liking and commenting.
- **Comment Management**: Edit or delete your comments if needed.
- **Real-time Chat**: Stay connected with friends via chat, with messages stored in the database.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Frontend**: React, ShadCN (UI components), TypeScript
- **Backend**: ElysiaJS (Fast and minimalist web framework for backend)
- **Database**: MongoDB / PostgreSQL (for storing user data, posts, comments, and chat messages)
- **Deployment**: Docker (Containerization)
- **Real-time Features**: WebSockets for real-time chat and post updates

## requirements
Set up the environment variables:

Create a .env file in the backend folder and configure the following:
DATABASE_URL=<your-database-url>
JWT_SECRET=<your-jwt-secret>

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ringer.git
   cd for client and backend
   npm install for both
   run seprately by npm run dev```
## Video Demo

If you'd like to see a demo of the platform in action, [watch this video](https://drive.google.com/file/d/1CNiaekxHh8lo1N0LFbyry73UBsSXEUsc/view?usp=drive_link).
