import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Box,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  PushPin as PinIcon,
  ArchiveOutlined as ArchiveIcon,
  DeleteOutlined as DeleteIcon,
  LabelOutlined as LabelIcon,
  AccessTime as ReminderIcon,
  Palette as ColorIcon,
  Image as ImageIcon,
  PersonAdd as PersonAddIcon,
  MoreOutlined as MoreIcon,
  CheckBox as CheckBoxIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberedListIcon,
} from '@mui/icons-material';
import { CREATE_NOTE, UPDATE_NOTE, DELETE_OR_RESTORE_NOTE } from '../graphql/mutations';
import { GET_NOTES } from '../graphql/queries';
import { useMutation } from '@apollo/client/react';

const NoteEditor = ({ open, onClose, note, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isPinned, setIsPinned] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [labelAnchorEl, setLabelAnchorEl] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [createNote] = useMutation(CREATE_NOTE, {
    refetchQueries: [{ query: GET_NOTES }],
  });
  const [updateNote] = useMutation(UPDATE_NOTE, {
    refetchQueries: [{ query: GET_NOTES }],
  });
  const [deleteOrRestoreNote] = useMutation(DELETE_OR_RESTORE_NOTE, {
    refetchQueries: [{ query: GET_NOTES }],
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setDescription(note.description || '');
      setBgColor(note.bg_color || '#ffffff');
      setIsPinned(note.is_pinned || false);
      setIsArchived(note.is_archived || false);
      setLabels(note.labelNames || []);
      // if (note.reminder_at) {
        const reminder = new Date(note.reminder_at);
        setReminderDate(reminder.toISOString().split('T')[0]);
        setReminderTime(reminder.toTimeString().slice(0, 5));
      // }
    } else {
      setTitle('');
      setDescription('');
      setBgColor('#ffffff');
      setIsPinned(false);
      setIsArchived(false);
      setLabels([]);
      setReminderDate('');
      setReminderTime('');
      setImage(null);
      setImagePreview(null);
    }
  }, [note]);

  const handleSave = async () => {
    try {
      const noteData = {
        title: title.trim() || null,
        description: description.trim(),
        bg_color: bgColor,
        is_archived: isArchived,
        is_reminder: !!reminderDate,
        reminder_at: reminderDate && reminderTime 
          ? new Date(`${reminderDate}T${reminderTime}`).toISOString()
          : null,
      };

      if (note) {
        await updateNote({
          variables: {
            noteId: parseFloat(note.id),
            data: noteData,
            bg_image: image,
          },
        });
      } else {
        await createNote({
          variables: {
            createNoteInput: noteData,
          },
        });
      }

      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDelete = async () => {
    if (note) {
      try {
        await deleteOrRestoreNote({
          variables: {
            noteId: parseFloat(note.id),
          },
        });
        onClose();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleColorChange = (color) => {
    setBgColor(color);
    setColorAnchorEl(null);
  };

  const handleLabelAdd = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel('');
    }
    setLabelAnchorEl(null);
  };

  const handleLabelRemove = (labelToRemove) => {
    setLabels(labels.filter(label => label !== labelToRemove));
  };

  const colors = [
    '#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90',
    '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8',
    '#e6e9ed', '#e8eaed', '#fce8e6', '#fce4ec', '#f3e5f5',
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: bgColor,
          borderRadius: 2,
          minHeight: 200,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {note ? 'Edit note' : 'Take a note...'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Pin note">
              <IconButton
                size="small"
                onClick={() => setIsPinned(!isPinned)}
                color={isPinned ? 'primary' : 'default'}
              >
                <PinIcon />
              </IconButton>
            </Tooltip>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <TextField
          fullWidth
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: '1.1rem', fontWeight: 500 },
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          placeholder="Take a note..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={6}
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
           {/* <Tooltip title="Add reminder" >
            <IconButton size="small">
              <ReminderIcon />
            </IconButton>
          </Tooltip> */}

          <Tooltip title="Collaborator">
            <IconButton size="small">
              <PersonAddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add image">
            <label htmlFor="note-image-upload">
              <input
                id="note-image-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <IconButton size="small" component="span">
                <ImageIcon />
              </IconButton>
            </label>
          </Tooltip>

          <Tooltip title="Add label">
            <IconButton
              size="small"
              onClick={(e) => setLabelAnchorEl(e.currentTarget)}
            >
              <LabelIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Change color">
            <IconButton
              size="small"
              onClick={(e) => setColorAnchorEl(e.currentTarget)}
            >
              <ColorIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="More options">
            <IconButton size="small">
              <MoreIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {imagePreview && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img src={imagePreview} alt="Note" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
            <Button color="error" size="small" onClick={() => { setImage(null); setImagePreview(null); }} sx={{ mt: 1 }}>Remove Image</Button>
          </Box>
        )}

        {labels.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {labels.map((label, index) => (
              <Chip
                key={index}
                label={label}
                size="small"
                onDelete={() => handleLabelRemove(label)}
                sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
              />
            ))}
          </Box>
        )}

        {reminderDate && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              type="date"
              size="small"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              type="time"
              size="small"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box>
            {note && (
              <Button
                color="error"
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            )}
          </Box>
          <Box>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!description.trim()}
            >
              {note ? 'Save' : 'Save'}
            </Button>
          </Box>
        </Box>
      </DialogContent>

      {/* Color Selection Menu */}
      <Menu
        anchorEl={colorAnchorEl}
        open={Boolean(colorAnchorEl)}
        onClose={() => setColorAnchorEl(null)}
      >
        <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
          {colors.map((color) => (
            <Box
              key={color}
              onClick={() => handleColorChange(color)}
              sx={{
                width: 30,
                height: 30,
                backgroundColor: color,
                borderRadius: '50%',
                cursor: 'pointer',
                border: color === bgColor ? '2px solid #000' : '2px solid transparent',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            />
          ))}
        </Box>
      </Menu>

      {/* Label Addition Menu */}
      <Menu
        anchorEl={labelAnchorEl}
        open={Boolean(labelAnchorEl)}
        onClose={() => setLabelAnchorEl(null)}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Label name"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleLabelAdd();
              }
            }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleLabelAdd}
            sx={{ mt: 1 }}
            disabled={!newLabel.trim()}
          >
            Add Label
          </Button>
        </Box>
      </Menu>
    </Dialog>
  );
};

export default NoteEditor;
