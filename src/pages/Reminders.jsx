import React, { useState, useEffect } from 'react';
import NoteEditor from '../components/NoteEditor';
import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { GET_NOTES } from '../graphql/queries';
import Layout from '../components/Layout';
import NoteCard from '../components/NoteCard';
import { useQuery } from '@apollo/client/react';

const Reminders = () => {
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorNote, setEditorNote] = useState(null);

  const { data, loading, error } = useQuery(GET_NOTES, {
    variables: { type: 'reminder' },
    fetchPolicy: 'cache-and-network',
  });

  // notes initialization moved inside useEffect to avoid dependency warning

  useEffect(() => {
    const notes = data?.getNotes?.notes || [];
    if (notes) {
      // Filter notes that have reminders and are not archived or deleted
      const filtered = notes.filter(note => 
        note.is_reminder && 
        !note.is_archived && 
        !note.deleted_at
      );
      // Sort by reminder date (soonest first)
      filtered.sort((a, b) => {
        if (!a.reminder_at) return 1;
        if (!b.reminder_at) return -1;
        return new Date(a.reminder_at) - new Date(b.reminder_at);
      });
      setFilteredNotes(filtered);
    }
  }, [data]);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ m: 2 }}>
          Error loading reminders: {error.message}
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 2, position: 'relative', minHeight: '80vh' }}>
        <Typography variant="h5" gutterBottom>Reminders</Typography>
        {filteredNotes.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="body1" color="text.secondary">No reminders found.</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredNotes.map(note => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
                <NoteCard note={note} />
              </Grid>
            ))}
          </Grid>
        )}
        {/* Floating Add Button */}
        <Tooltip title="Add Reminder">
          <IconButton
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 1000,
              background: 'linear-gradient(135deg, #fbbc04 60%, #fff475 100%)',
              color: '#fff',
              boxShadow: '0 4px 24px 0 rgba(251,188,4,0.25)',
              width: 64,
              height: 64,
              borderRadius: '50%',
              fontSize: 32,
              transition: 'box-shadow 0.2s',
              '&:hover': {
                background: 'linear-gradient(135deg, #f9a825 60%, #ffe066 100%)',
                boxShadow: '0 8px 32px 0 rgba(251,188,4,0.35)',
              },
            }}
            onClick={() => { setEditorNote(null); setEditorOpen(true); }}
            size="large"
          >
            <AddIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Tooltip>
        <NoteEditor
          open={editorOpen}
          onClose={() => setEditorOpen(false)}
          note={editorNote}
          onSave={() => setEditorOpen(false)}
        />
      </Box>
    </Layout>
  );
};

export default Reminders;
