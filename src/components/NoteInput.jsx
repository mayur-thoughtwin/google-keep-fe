import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Collapse,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Palette as ColorIcon,
  Image as ImageIcon,
  PersonAdd as PersonAddIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

const NoteInput = ({ onSave, onClose, expanded, onExpand }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');

  const handleSave = () => {
    if (description.trim()) {
      onSave({
        title: title.trim() || null,
        description: description.trim(),
        bg_color: bgColor,
      });
      setTitle('');
      setDescription('');
      setBgColor('#ffffff');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  const colors = [
    '#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90',
    '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8',
  ];

  return (
    <Paper
      elevation={expanded ? 8 : 2}
      sx={{
        borderRadius: 5,
        marginInline: 10,
        backgroundColor: bgColor,
        transition: 'all 0.2s ease',
        cursor: expanded ? 'default' : 'pointer',
        '&:hover': {
          boxShadow: expanded ? 8 : 4,
        },
      }}
      onClick={!expanded ? onExpand : undefined}
    >
      <Box sx={{ p: 2 }}>
        <TextField
          // fullWidth
          placeholder={expanded ? "Title" : "Take a noteeee..."}
          value={expanded ? title : (title || description)}
          onChange={(e) => {
            if (expanded) {
              setTitle(e.target.value);
            } else {
              setDescription(e.target.value);
            }
          }}
          onFocus={!expanded ? onExpand : undefined}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: { 
              fontSize: expanded ? '1.1rem' : '1rem',
              fontWeight: expanded ? 500 : 400,
            },
          }}
          onKeyPress={handleKeyPress}
        />

        <Collapse in={expanded}>
          <TextField
            fullWidth
            placeholder="Take a note..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
            onKeyPress={handleKeyPress}
            sx={{ mt: 1 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Add reminder">
                <IconButton size="small">
                  <AddIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Collaborator">
                <IconButton size="small">
                  <PersonAddIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Add image">
                <IconButton size="small">
                  <ImageIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Change color">
                <IconButton size="small">
                  <ColorIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="More options">
                <IconButton size="small">
                  <MoreIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {colors.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setBgColor(color)}
                    sx={{
                      width: 20,
                      height: 20,
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
              <IconButton size="small" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                }}
              >
                Press Ctrl+Enter to save
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default NoteInput;
