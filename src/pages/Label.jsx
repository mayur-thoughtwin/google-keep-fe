import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import Layout from "../components/Layout";
import NoteCard from "../components/NoteCard";
import NoteEditor from "../components/NoteEditor";
import { GET_NOTES_BY_LABEL_ID } from "../graphql/queries";
import { useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom"; // 👈 import useParams

const LabelNotes = () => {
  const { labelId } = useParams(); // 👈 get it from the URL
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorNote, setEditorNote] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_NOTES_BY_LABEL_ID, {
    variables: { labelId: parseFloat(labelId) }, // 👈 use it here
    fetchPolicy: "cache-and-network",
    skip: !labelId, // avoid running if labelId is undefined
  });

  useEffect(() => {
    const notes = data?.getNotesByLabelId?.notes || [];
    if (notes) {
      setFilteredNotes(notes);
    }
  }, [data]);

  // editor handlers
  const handleEditNote = (note) => {
    setEditorNote(note);
    setEditorOpen(true);
  };

  const handleEditorClose = () => {
    setEditorOpen(false);
    setEditorNote(null);
  };

  const handleNoteSave = () => {
    refetch();
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
          Error loading notes: {error.message}
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
            Notes with Label #{labelId}
          </Typography>
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
              No notes found for this label
            </Typography>
            <Typography variant="body2">
              Notes with this label will appear here
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredNotes.map((note) => (
              <Grid item key={note.id} xs={12} sm={6} md={4} lg={3}>
                <NoteCard
                  note={note}
                  onEdit={() => handleEditNote(note)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Note Editor */}
        <NoteEditor
          open={editorOpen}
          onClose={handleEditorClose}
          note={editorNote}
          onSave={handleNoteSave}
        />
      </Box>
    </Layout>
  );
};

export default LabelNotes;
