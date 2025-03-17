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
  - @tinymce/tinymce-react for rich text editing

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
git clone https://github.com/kimbef/blog-zwei
cd blog-zwei
```

2. Install dependencies:
```bash
# First, ensure you have the correct React version in package.json
# Update your package.json to use React 18:
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}

# Then install dependencies
npm install
# or
yarn install
```

If you encounter dependency conflicts, you can use one of these approaches:

```bash
# Option 1: Use legacy peer deps
npm install --legacy-peer-deps

# Option 2: Force install
npm install --force

# Option 3: Clean install
rm -rf node_modules package-lock.json
npm install
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

## Troubleshooting

### Common Issues

1. **Dependency Conflicts**
   - If you see errors about React version conflicts, ensure you're using React 18
   - Update your package.json to use compatible versions:
     ```json
     {
       "dependencies": {
         "react": "^18.2.0",
         "react-dom": "^18.2.0",
         "@tinymce/tinymce-react": "^6.0.0"
       }
     }
     ```

2. **Firebase Configuration**
   - Ensure all Firebase environment variables are correctly set
   - Check that Firebase Authentication and Realtime Database are enabled
   - Verify database rules are properly configured

3. **Build Errors**
   - Clear your node_modules and reinstall:
     ```bash
     rm -rf node_modules package-lock.json
     npm install
     ```
   - Check for TypeScript errors:
     ```bash
     npm run type-check
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

## Firebase Configuration

### Security Rules

Set up the following security rules in your Firebase Realtime Database:

```json
{
  "rules": {
    "posts": {
      ".read": true,  // Anyone can read posts
      ".write": "auth != null",  // Only authenticated users can write
      "$postId": {
        ".validate": "newData.hasChildren(['title', 'content', 'authorId', 'createdAt'])",
        "comments": {
          ".read": true,
          ".write": "auth != null",
          "$commentId": {
            ".validate": "newData.hasChildren(['text', 'authorId', 'createdAt'])",
            "replies": {
              ".read": true,
              ".write": "auth != null",
              "$replyId": {
                ".validate": "newData.hasChildren(['text', 'authorId', 'createdAt'])"
              }
            }
          }
        }
      }
    },
    "users": {
      "$uid": {
        ".read": true,
        ".write": "auth != null && auth.uid == $uid",
        "posts": {
          ".read": true,
          ".write": "auth != null && auth.uid == $uid"
        }
      }
    }
  }
}
```

These rules implement the following security measures:

1. **Posts Collection**:
   - Public read access for all posts
   - Only authenticated users can create/edit/delete posts
   - Each post must have required fields (title, content, authorId, createdAt)

2. **Comments**:
   - Public read access for all comments
   - Only authenticated users can create/edit/delete comments
   - Each comment must have required fields (text, authorId, createdAt)

3. **Replies**:
   - Public read access for all replies
   - Only authenticated users can create/edit/delete replies
   - Each reply must have required fields (text, authorId, createdAt)

4. **Users Collection**:
   - Public read access for user profiles
   - Users can only modify their own profile data
   - Users can only manage their own posts

### Database Structure

```
{
  "posts": {
    "$postId": {
      "title": "string",
      "content": "string",
      "authorId": "string",
      "createdAt": "timestamp",
      "likes": "number",
      "comments": {
        "$commentId": {
          "text": "string",
          "authorId": "string",
          "createdAt": "timestamp",
          "likes": "number",
          "dislikes": "number",
          "replies": {
            "$replyId": {
              "text": "string",
              "authorId": "string",
              "createdAt": "timestamp",
              "likes": "number",
              "dislikes": "number"
            }
          }
        }
      }
    }
  },
  "users": {
    "$uid": {
      "email": "string",
      "displayName": "string",
      "photoURL": "string",
      "posts": {
        "$postId": true
      }
    }
  }
}
```

### Setting Up Firebase

1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Create a Realtime Database
4. Set up the security rules as shown above
5. Copy your Firebase configuration to `src/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
```
