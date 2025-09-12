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

const Archive = () => {
  const [filteredNotes, setFilteredNotes] = useState([]);

  const { data, loading, error } = useQuery(GET_NOTES, {
    variables: { type: 'archive' },
    fetchPolicy: 'cache-and-network',
  });

  const notes = data?.getNotes?.notes || [];

  useEffect(() => {
    if (notes) {
      // Filter archived notes that are not deleted
      const filtered = notes.filter(note => 
        note.is_archived && 
        !note.deleted_at
      );
      
      // Sort by archive date (most recent first)
      filtered.sort((a, b) => new Date(b.archived_at) - new Date(a.archived_at));
      
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
          Error loading archive: {error.message}
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
          Archive
        </Typography>

        {filteredNotes.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300,
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Archive is empty
            </Typography>
            <Typography variant="body2">
              Notes you archive will appear here
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredNotes.map((note) => (
              <Grid item key={note.id} xs={12} sm={6} md={4} lg={3}>
                <NoteCard note={note} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default Archive;
