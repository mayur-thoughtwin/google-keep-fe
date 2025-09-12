import React, { useState, useEffect } from 'react';
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

  const { data, loading, error } = useQuery(GET_NOTES, {
    variables: { type: 'reminder' },
    fetchPolicy: 'cache-and-network',
  });

  const notes = data?.getNotes?.notes || [];

  useEffect(() => {
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
  }, [notes]);

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
      <Box sx={{ p: 2 }}>
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
      </Box>
    </Layout>
  );
};

export default Reminders;
