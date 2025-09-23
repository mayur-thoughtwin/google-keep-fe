import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DeleteForever as EmptyIcon } from "@mui/icons-material";
import { GET_NOTES } from "../graphql/queries";
import {
  EMPTY_TRASH as EMPTY_TRASH_MUTATION,
  DELETE_OR_RESTORE_NOTE,
} from "../graphql/mutations";
import Layout from "../components/Layout";
import NoteCard from "../components/NoteCard";
import NoteEditor from "../components/NoteEditor";
import { useMutation, useQuery } from "@apollo/client/react";

const Trash = () => {
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [emptyDialogOpen, setEmptyDialogOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorNote, setEditorNote] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_NOTES, {
    variables: { type: "trash" },
    fetchPolicy: "cache-and-network",
  });

  const [emptyTrash] = useMutation(EMPTY_TRASH_MUTATION, {
    refetchQueries: [{ query: GET_NOTES, variables: { type: "trash" } }],
  });

  const [deleteOrRestoreNote] = useMutation(DELETE_OR_RESTORE_NOTE, {
    refetchQueries: [{ query: GET_NOTES, variables: { type: "trash" } }],
  });

  useEffect(() => {
    const notes = data?.getNotes?.notes || [];
    if (notes) {
      const filtered = notes.filter((note) => note.deleted_at);
      filtered.sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at));
      setFilteredNotes(filtered);
    }
  }, [data?.getNotes?.notes]);

  // Editor handlers
  const handleEditNote = (note) => {
    setEditorNote(note);
    setEditorOpen(true);
  };

  const handleEditorClose = () => {
    setEditorOpen(false);
    setEditorNote(null);
  };

  const handleNoteSave = () => {
    refetch(); // Refresh trash after save
  };

  // Empty trash
  const handleEmptyTrash = async () => {
    try {
      await emptyTrash();
      setEmptyDialogOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to empty trash:", err);
    }
  };

  const handleRestoreNote = async (noteId) => {
    try {
      await deleteOrRestoreNote({
        variables: { noteId: parseFloat(noteId) },
      });
      refetch();
    } catch (err) {
      console.error("Failed to restore note:", err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 300,
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ m: 2 }}>
          Error loading trash: {error.message}
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Trash
          </Typography>
          {filteredNotes.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<EmptyIcon />}
              onClick={() => setEmptyDialogOpen(true)}
            >
              Empty trash
            </Button>
          )}
        </Box>

        {filteredNotes.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
              color: "text.secondary",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Trash is empty
            </Typography>
            <Typography variant="body2">
              Deleted notes will appear here
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredNotes.map((note) => (
              <Grid item key={note.id} xs={12} sm={6} md={4} lg={3}>
                <NoteCard
                  note={note}
                  isTrash
                  onRestore={() => handleRestoreNote(note.id)}
                  onEdit={() => handleEditNote(note)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty Trash Confirmation Dialog */}
        <Dialog
          open={emptyDialogOpen}
          onClose={() => setEmptyDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Empty trash?</DialogTitle>
          <DialogContent>
            <Typography>
              This will permanently delete all notes in trash. This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEmptyDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleEmptyTrash}
              color="error"
              variant="contained"
            >
              Empty trash
            </Button>
          </DialogActions>
        </Dialog>

        {/* Note Editor */}
        <NoteEditor
          open={editorOpen}
          onClose={handleEditorClose}
          note={editorNote}
          isTrash={true}
          onSave={handleNoteSave}
        />
      </Box>
    </Layout>
  );
};

export default Trash;
