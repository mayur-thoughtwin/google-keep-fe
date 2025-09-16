/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Fab,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GET_NOTES } from '../graphql/queries';
import Layout from '../components/Layout';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import NoteInput from '../components/NoteInput';
import { useQuery } from '@apollo/client/react';

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [inputExpanded, setInputExpanded] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_NOTES, {
    variables: { type: null, query: searchQuery },
    fetchPolicy: 'cache-and-network',
  });

  const notes = data?.getNotes?.notes || [];

  useEffect(() => {
    if (notes) {
      let filtered = notes.filter(note => !note.is_archived && !note.deleted_at);
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(note => 
          note.title?.toLowerCase().includes(query) ||
          note.description?.toLowerCase().includes(query) ||
          note.labelNames?.some(label => label.toLowerCase().includes(query))
        );
      }

      // Sort by creation date (newest first)
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setFilteredNotes(filtered);
    }
  }, [notes, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleViewToggle = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const handleAddNote = () => {
    setSelectedNote(null);
    setEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setEditorOpen(true);
  };

  const handleEditorClose = () => {
    setEditorOpen(false);
    setSelectedNote(null);
  };

  const handleNoteSave = () => {
    // Note will be refetched automatically due to refetchQueries in mutations
  };

  const handleQuickSave = async (noteData) => {
    try {
      const { createNote } = await import('../graphql/mutations');
      // This would need to be implemented with the actual mutation
      console.log('Quick save:', noteData);
      setInputExpanded(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

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
          Error loading notes: {error.message}
        </Alert>
      </Layout>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout
        onRefresh={handleRefresh}
        onSearch={handleSearch}
        onViewToggle={handleViewToggle}
        viewMode={viewMode}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Take a note input */}
        <Box sx={{ mb: 3 }}>
          <NoteInput
            expanded={inputExpanded}
            onExpand={() => setInputExpanded(true)}
            onClose={() => setInputExpanded(false)}
            onSave={handleQuickSave}
          />
        </Box>

        {/* Notes Grid/List */}
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
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </Typography>
            <Typography variant="body2">
              {searchQuery 
                ? 'Try a different search term' 
                : 'Click "Take a note..." to create your first note'
              }
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={2}
            sx={{
              ...(viewMode === 'list' && {
                flexDirection: 'column',
                '& .MuiGrid-item': {
                  maxWidth: '100%',
                },
              }),
            }}
          >
            {filteredNotes.map((note) => (
              <Grid
                item
                key={note.id}
                xs={viewMode === 'list' ? 12 : 12}
                sm={viewMode === 'list' ? 12 : 6}
                md={viewMode === 'list' ? 12 : 4}
                lg={viewMode === 'list' ? 12 : 3}
              >
                <NoteCard
                  note={note}
                  onEdit={handleEditNote}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddNote}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            backgroundColor: '#fbbc04',
            '&:hover': {
              backgroundColor: '#f9ab00',
            },
          }}
        >
          <AddIcon />
        </Fab>

        {/* Note Editor Modal */}
        <NoteEditor
          open={editorOpen}
          onClose={handleEditorClose}
          note={selectedNote}
          onSave={handleNoteSave}
        />
        </Box>
      </Layout>
    </DndProvider>
  );
};

export default Notes;
