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

3.  **Set up Firebase:**
    a. Go to your [Firebase Console](https://console.firebase.google.com/).
    b. Create a new project (or use an existing one).
    c. Add a new Web App to your project.
    d. Copy the Firebase configuration object provided.

4.  **Configure Environment Variables:**
    a. Create a file named `.env` in the root of your project.
    b. Paste your Firebase configuration values into the `.env` file. **Important:** The variable names must start with `NEXT_PUBLIC_`.
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```
    
5. **Enable Firebase Services:**
   a. In the Firebase Console, go to the **Authentication** section and enable the **Email/Password** and **Google** sign-in providers.
   b. Go to the **Firestore Database** section and create a new database. Start in **test mode** for initial development (you can secure it with security rules later).

6.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is ready to be deployed to platforms like [Vercel](https://vercel.com/) or [Firebase Hosting](https://firebase.google.com/docs/hosting).

### Deploying to Vercel

1.  Push your code to a Git repository (e.g., GitHub).
2.  Import the repository into Vercel.
3.  Vercel will automatically detect that it's a Next.js project.
4.  Add your Firebase environment variables in the Vercel project settings.
5.  Deploy!

### Deploying to Firebase Hosting

You can also deploy this Next.js app using Firebase Hosting. Please refer to the official Firebase documentation for deploying Next.js applications for the most up-to-date instructions.
