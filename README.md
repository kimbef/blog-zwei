# Modern Blog Application

A feature-rich blog application built with React, TypeScript, and Material-UI, featuring real-time updates and a modern user interface.

## Features

### Core Features
- 🔐 User Authentication (Login/Register)
- 📝 Create, Read, Update, and Delete blog posts
- 👤 User profiles with post history
- 💬 Interactive comments and replies
- ❤️ Like and rate posts
- 📱 Fully responsive design
- 🎨 Modern Material-UI components
- 🔄 Real-time updates using Firebase

### User Experience
- Smooth animations and transitions
- Loading states and skeleton screens
- Toast notifications for user feedback
- Mobile-friendly navigation
- Protected routes for authenticated users

## Tech Stack

- **Frontend Framework:** React with TypeScript
- **UI Library:** Material-UI (MUI)
- **State Management:** React Context
- **Routing:** React Router
- **Backend:** Firebase
  - Authentication
  - Realtime Database
- **Styling:** 
  - MUI Theme
  - CSS-in-JS
- **Additional Libraries:**
  - react-toastify for notifications
  - date-fns for date formatting

## Project Structure

```
src/
├── auth/                 # Authentication components
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Profile.tsx
├── components/          # Reusable components
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   └── LoadingScreen.tsx
├── context/            # Context providers
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── CreatePost.tsx
│   ├── EditPost.tsx
│   ├── PostDetails.tsx
│   └── MyPosts.tsx
├── firebase.ts         # Firebase configuration
├── realtimeDB.ts       # Database operations
├── theme.ts           # MUI theme configuration
└── App.tsx            # Main application component
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account and project

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd blog-zwei
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a Firebase project and add your configuration:
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Create a Realtime Database
   - Copy your Firebase configuration to `src/firebase.ts`

4. Start the development server:
```bash
npm start
# or
yarn start
```

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Features in Detail

### Authentication
- Email/Password authentication
- Protected routes
- Persistent sessions
- User profile management

### Blog Posts
- Create new posts with title and content
- Edit existing posts
- Delete posts
- View post details
- Like and rate posts
- Real-time updates

### Comments
- Add comments to posts
- Reply to comments
- Like/dislike comments
- Nested comment structure

### User Interface
- Responsive design for all screen sizes
- Modern card-based layout
- Loading states and animations
- Error handling and notifications
- Clean and intuitive navigation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the beautiful components
- Firebase for the backend services
- React community for the amazing ecosystem
