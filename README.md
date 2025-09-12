# Google Keep Clone

A modern, responsive Google Keep clone built with React, Material-UI, and GraphQL. This application replicates the core functionality of Google Keep with a clean, intuitive interface.

## Features

### Core Functionality
- ✅ **Create, Edit, and Delete Notes** - Full CRUD operations for notes
- ✅ **Search Notes** - Fast search across titles, descriptions, and labels
- ✅ **Archive Notes** - Archive notes to keep them organized
- ✅ **Trash Management** - Soft delete with restore functionality and empty trash
- ✅ **Reminders** - Set date and time reminders for notes
- ✅ **Labels System** - Create, edit, and assign labels to notes
- ✅ **Color Coding** - Multiple background colors for visual organization
- ✅ **Pin Notes** - Pin important notes to the top
- ✅ **Settings** - User preferences and theme customization

### UI/UX Features
- ✅ **Material Design** - Clean, modern interface following Material Design principles
- ✅ **Responsive Layout** - Works on desktop, tablet, and mobile devices
- ✅ **Dark/Light Theme** - Toggle between themes
- ✅ **Grid/List View** - Switch between card grid and list layouts
- ✅ **Drag & Drop** - Rearrange notes by dragging (ready for implementation)
- ✅ **Quick Note Input** - Expandable input field for fast note creation
- ✅ **Hover Actions** - Contextual actions appear on hover

### Technical Features
- ✅ **GraphQL Integration** - Full GraphQL client with Apollo
- ✅ **Authentication** - Google OAuth integration
- ✅ **Real-time Updates** - Automatic cache updates and refetching
- ✅ **Error Handling** - Comprehensive error handling and user feedback
- ✅ **Loading States** - Smooth loading indicators throughout the app

## Tech Stack

- **Frontend**: React 19, Material-UI 7, React Router DOM 7
- **State Management**: Apollo Client 4
- **Styling**: Material-UI with custom theme
- **Drag & Drop**: React DnD
- **Build Tool**: Vite 7
- **Backend**: GraphQL API (provided)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with sidebar and top bar
│   ├── NoteCard.jsx    # Individual note card component
│   ├── NoteEditor.jsx  # Note creation/editing modal
│   ├── NoteInput.jsx   # Quick note input component
│   └── DraggableNoteCard.jsx # Drag and drop wrapper
├── pages/              # Page components
│   ├── Notes.jsx       # Main notes page
│   ├── Reminders.jsx   # Reminders page
│   ├── Archive.jsx     # Archived notes page
│   ├── Trash.jsx       # Deleted notes page
│   ├── Settings.jsx    # User settings page
│   └── LoginPage.jsx   # Authentication page
├── graphql/            # GraphQL queries and mutations
│   ├── queries.js      # All GraphQL queries
│   └── mutations.js    # All GraphQL mutations
├── hooks/              # Custom React hooks
│   └── useGoogleAuth.js # Google authentication hook
├── config/             # Configuration files
│   └── googleAuth.js   # Google OAuth configuration
└── route/              # Routing configuration
    └── route.jsx       # Main router setup
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GraphQL backend running on `http://localhost:3000/graphql`

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd keep-fe
```

2. Install dependencies
```bash
npm install
```

3. Configure Google OAuth
   - Update `src/config/googleAuth.js` with your Google OAuth credentials
   - Set up OAuth redirect URI in Google Console

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## GraphQL Schema

The application expects the following GraphQL schema:

```graphql
type Note {
  id: Int!
  user_id: Int!
  title: String!
  description: String!
  bg_color: String
  bg_image: String
  is_archived: Boolean!
  archived_at: DateTime
  is_edited: Boolean!
  edited_at: DateTime
  is_reminder: Boolean!
  reminder_at: DateTime
  latitude: Float
  longitude: Float
  deleted_at: DateTime
  created_at: DateTime!
  updated_at: DateTime!
  files: [Storage!]
  noteLabels: [NoteLabels!]
  labelNames: [String!]
}

type Settings {
  id: Int!
  user_id: Int!
  is_new_item_at_bottom: Boolean!
  is_display_rich: Boolean!
  is_checked_item_at_bottom: Boolean!
  is_dark_theme: Boolean!
  is_sharing: Boolean!
  created_at: DateTime
  updated_at: DateTime
  user: User
}

type User {
  id: ID!
  email: String!
  googleId: String
  name: String
  picture: String
  createdAt: DateTime
}
```

## Key Features Implementation

### Note Management
- **Create**: Quick input field expands to full editor
- **Edit**: Click any note to open the editor modal
- **Delete**: Soft delete moves notes to trash
- **Archive**: Archive notes to keep them organized
- **Pin**: Pin important notes (UI ready, backend integration needed)

### Search & Filtering
- **Global Search**: Search across all notes by title, description, or labels
- **Type Filtering**: Filter by notes, reminders, archive, or trash
- **Real-time**: Search updates as you type

### Settings & Customization
- **Theme Toggle**: Switch between light and dark themes
- **Display Options**: Configure note display preferences
- **Label Management**: Create, edit, and delete custom labels
- **User Preferences**: All settings sync with backend

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Keep for the design inspiration
- Material-UI for the component library
- Apollo GraphQL for the client implementation
- React DnD for drag and drop functionality