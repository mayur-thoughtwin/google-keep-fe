import { gql } from '@apollo/client';

// Settings mutations
export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($settings: UpdateSettingsInput!) {
    updateSettings(settings: $settings) {
      success
      message
      timestamp
      data
    }
  }
`;

// Note mutations
export const CREATE_NOTE = gql`
  mutation CreateNote($createNoteInput: AddNotesInput!, $label: String, $bg_image: Upload, $images: [Upload!]) {
    createNote(createNoteInput: $createNoteInput, label: $label, bg_image: $bg_image, images: $images) {
      success
      message
      timestamp
      data
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($noteId: Float!, $data: UpdateNotesInput!, $bg_image: Upload, $images: [Upload!]) {
    updateNote(noteId: $noteId, data: $data, bg_image: $bg_image, images: $images) {
      success
      message
      timestamp
      data
    }
  }
`;

export const DELETE_OR_RESTORE_NOTE = gql`
  mutation DeleteOrRestoreNote($noteId: Float!) {
    deleteOrRestoreNote(noteId: $noteId) {
      success
      message
      timestamp
      data
    }
  }
`;

export const EMPTY_TRASH = gql`
  mutation EmptyTrash {
    emptyTrash {
      success
      message
      timestamp
      data
    }
  }
`;

// Label mutations
export const ADD_LABEL = gql`
  mutation AddLabel($label: AddLabelInput!) {
    addLabel(label: $label) {
      success
      message
      timestamp
      data
    }
  }
`;

export const UPDATE_LABEL = gql`
  mutation UpdateLabel($labelId: Float!, $data: AddLabelInput!) {
    updateLabel(labelId: $labelId, data: $data) {
      success
      message
      timestamp
      data
    }
  }
`;

export const DELETE_LABEL = gql`
  mutation DeleteLabel($labelId: Float!) {
    deleteLabel(labelId: $labelId) {
      success
      message
      timestamp
      data
    }
  }
`;

export const ASSIGN_LABEL = gql`
  mutation AssignLabel($noteId: Float!, $labelName: String!) {
    assignLabel(noteId: $noteId, labelName: $labelName) {
      success
      message
      timestamp
      data
    }
  }
`;
