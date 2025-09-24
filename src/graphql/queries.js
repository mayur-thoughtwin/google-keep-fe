import { gql } from "@apollo/client";

// User queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      picture
      googleId
      createdAt
    }
  }
`;

// Settings queries
export const GET_SETTINGS = gql`
  query GetSettings {
    getSettings {
      settings {
        id
        user_id
        is_new_item_at_bottom
        is_display_rich
        is_checked_item_at_bottom
        is_dark_theme
        is_sharing
        created_at
        updated_at
      }
    }
  }
`;

// Notes queries
export const GET_NOTES = gql`
  query GetNotes($type: String, $query: String) {
    getNotes(type: $type, query: $query) {
      notes {
        id
        user_id
        title
        description
        bg_color
        bg_image
        is_archived
        archived_at
        is_edited
        edited_at
        is_reminder
        reminder_at
        latitude
        longitude
        deleted_at
        created_at
        updated_at
        files {
          id
          ref_id
          type
          url
          created_at
        }
        noteLabels {
          id
          note_id
          label_id
          created_at
          labelName
        }
        labelNames
      }
    }
  }
`;

// Labels queries
export const GET_LABELS = gql`
  query GetLabels {
    getLabels {
      success
      message
      timestamp
      data
    }
  }
`;

// Notes by Label id query
export const GET_NOTES_BY_LABEL_ID = gql`
  query GetNotesByLabelId($labelId: Float!) {
    getNotesByLabelId(labelId: $labelId) {
      notes {
        id
        user_id
        title
        description
        bg_color
        bg_image
        is_archived
        archived_at
        is_edited
        edited_at
        is_reminder
        reminder_at
        latitude
        longitude
        deleted_at
        created_at
        updated_at
        files {
          id
          ref_id
          type
          url
          created_at
        }
        noteLabels {
          id
          note_id
          label_id
          created_at
          labelName
        }
        labelNames
      }
    }
  }
`;


