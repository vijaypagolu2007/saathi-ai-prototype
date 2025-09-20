# SaathiAI Web - Your Personal Wellness Companion

This is a Next.js application that provides a safe and supportive space for users to track their mental well-being through journaling, mood tracking, and interaction with an empathetic AI assistant. The project is integrated with Firebase for authentication and data storage.

## Features

- **Empathetic AI Chat**: Anonymous and supportive chat with a Gemini-powered AI.
- **Journaling**: A private space for users to write down their thoughts and feelings. Entries are saved securely in Firestore.
- **Mood Tracking**: Visualize mood trends over time with an interactive chart.
- **Resilience Tree**: A gamified feature where a tree grows as you interact with the app, symbolizing your personal growth.
- **Firebase Integration**: Secure user authentication and data persistence with Firebase Auth and Firestore.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Firebase](https://firebase.google.com/) project
- A [Google AI Studio API Key](https://aistudio.google.com/app/apikey)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd saathi-ai-web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    You will need a `.env.local` file in the root of your project to store your API keys. Create this file and add the following, replacing `YOUR_API_KEY_HERE` with your actual key from Google AI Studio.

    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Firebase Configuration:**
    The Firebase configuration for this project is included directly in the source code. However, you will still need to set up your own Firebase project in the cloud to use features like Authentication and Firestore.

5. **Enable Firebase Services:**
   a. Go to your [Firebase Console](https://console.firebase.google.com/).
   b. Create a new project (or use the project ID `saathiai-web`).
   c. In the Firebase Console, go to the **Authentication** section and enable the **Email/Password** and **Google** sign-in providers.
   d. Go to the **Firestore Database** section and create a new database. Start in **test mode** for initial development (you can secure it with security rules later).

6.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is ready to be deployed to platforms like [Vercel](https://vercel.com/) or [Firebase Hosting](https://firebase.google.com/docs/hosting). When deploying, you will need to configure your environment variables (like `GEMINI_API_KEY`) in your hosting provider's settings.
