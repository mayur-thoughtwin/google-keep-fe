import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  PushPin as PinIcon,
  ArchiveOutlined as ArchiveIcon,
  DeleteOutlined as DeleteIcon,
  Add as AddIcon,
  LabelOutlined as LabelIcon,
  AccessTime as ReminderIcon,
  Palette as ColorIcon,
  Image as ImageIcon,
  MoreOutlined as MoreIcon,
} from "@mui/icons-material";
import {
  UPDATE_NOTE,
  DELETE_OR_RESTORE_NOTE,
  ASSIGN_LABEL,
} from "../graphql/mutations";
import { GET_NOTES } from "../graphql/queries";
import { useMutation } from "@apollo/client/react";

const NoteCard = ({
  note,
  onEdit,
  onPin,
  onArchive,
  onDelete,
  onColorChange,
  onLabelAdd,
  isTrash,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [labelDialogOpen, setLabelDialogOpen] = useState(false);
  const [colorDialogOpen, setColorDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  const [updateNote] = useMutation(UPDATE_NOTE, {
    refetchQueries: [{ query: GET_NOTES }],
  });
  const [deleteOrRestoreNote] = useMutation(DELETE_OR_RESTORE_NOTE, {
    refetchQueries: [{ query: GET_NOTES }],
  });
  const [assignLabel] = useMutation(ASSIGN_LABEL, {
    refetchQueries: [{ query: GET_NOTES }],
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePin = async () => {
    try {
      await updateNote({
        variables: {
          noteId: parseFloat(note.id),
          data: {
            is_edited: true,
            edited_at: new Date().toISOString(),
          },
        },
      });
      onPin?.(note.id);
    } catch (error) {
      console.error("Error pinning note:", error);
    }
    handleMenuClose();
  };

  const handleArchive = async () => {
    try {
      await updateNote({
        variables: {
          noteId: parseFloat(note.id),
          data: {
            is_archived: !note.is_archived,
            archived_at: note.is_archived ? null : new Date().toISOString(),
          },
        },
      });
      onArchive?.(note.id);
    } catch (error) {
      console.error("Error archiving note:", error);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await deleteOrRestoreNote({
        variables: {
          noteId: parseFloat(note.id),
        },
      });
      onDelete?.(note.id);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
    handleMenuClose();
  };

  const handleColorChange = async (color) => {
    try {
      await updateNote({
        variables: {
          noteId: parseFloat(note.id),
          data: {
            bg_color: color,
          },
        },
      });
      onColorChange?.(note.id, color);
    } catch (error) {
      console.error("Error changing color:", error);
    }
    setColorDialogOpen(false);
  };

  const handleLabelAssign = async () => {
    if (selectedLabel) {
      try {
        await assignLabel({
          variables: {
            noteId: parseFloat(note.id),
            labelName: selectedLabel,
          },
        });
        onLabelAdd?.(note.id, selectedLabel);
      } catch (error) {
        console.error("Error assigning label:", error);
      }
    }
    setLabelDialogOpen(false);
    setSelectedLabel("");
  };

  const colors = [
    "#ffffff",
    "#f28b82",
    "#fbbc04",
    "#fff475",
    "#ccff90",
    "#a7ffeb",
    "#cbf0f8",
    "#aecbfa",
    "#d7aefb",
    "#fdcfe8",
    "#e6e9ed",
    "#e8eaed",
    "#fce8e6",
    "#fce4ec",
    "#f3e5f5",
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Card
      onClick={() => onEdit?.(note)}
        sx={{
          width: 220, // fixed width
          height: 100, // fixed height (constant for all cards)
          backgroundColor: note.bg_color || "#ffffff",
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden", 
          "&:hover": {
            boxShadow:
              "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
            "& .note-actions": {
              opacity: 1,
            },
          },
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          {note.title && (
            <Typography
              variant="h6"
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                mb: 1,
                wordBreak: "break-word",
              }}
            >
              {note.title}
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
              mb: 1,
            }}
          >
            {note.description}
          </Typography>

          {note.labelNames && note.labelNames.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
              {note.labelNames.map((label, index) => (
                <Chip
                  key={index}
                  label={label}
                  size="small"
                  sx={{
                    fontSize: "0.75rem",
                    height: 20,
                    backgroundColor: "rgba(0,0,0,0.1)",
                  }}
                />
              ))}
            </Box>
          )}

          {note.reminder_at && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <ReminderIcon
                sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
              />
              <Typography variant="caption" color="text.secondary">
                {new Date(note.reminder_at).toLocaleDateString()}
              </Typography>
            </Box>
          )}

          <Box
            className="note-actions"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              opacity: 0,
              transition: "opacity 0.2s",
              display: "flex",
              gap: 0.5,
            }}
          >
            <Tooltip title="More options">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e);
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {note.is_edited && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {formatDate(note.edited_at)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handlePin}>
          <ListItemIcon>
            <PinIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Pin note</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleArchive}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {note.is_archived ? "Unarchive" : "Archive"}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => setColorDialogOpen(true)}>
          <ListItemIcon>
            <ColorIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Change color" />
        </MenuItem>

        <MenuItem onClick={() => setReminderDialogOpen(true)}>
          <ListItemIcon>
            <ReminderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add reminder" />
        </MenuItem>

        <MenuItem onClick={() => setLabelDialogOpen(true)}>
          <ListItemIcon>
            <LabelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add label</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          sx={{ color: isTrash ? "primary.main" : "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon
              fontSize="small"
              color={isTrash ? "primary" : "error"}
            />
          </ListItemIcon>
          <ListItemText>{isTrash ? "Restore" : "Delete"}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Color Selection Dialog */}
      <Dialog open={colorDialogOpen} onClose={() => setColorDialogOpen(false)}>
        <DialogTitle>Choose color</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1,
              mt: 1,
            }}
          >
            {colors.map((color) => (
              <Box
                key={color}
                onClick={() => handleColorChange(color)}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: color,
                  borderRadius: "50%",
                  cursor: "pointer",
                  border:
                    color === note.bg_color
                      ? "2px solid #000"
                      : "2px solid transparent",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Label Assignment Dialog */}
      <Dialog open={labelDialogOpen} onClose={() => setLabelDialogOpen(false)}>
        <DialogTitle>Add label</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Label name"
            value={selectedLabel}
            onChange={(e) => setSelectedLabel(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLabelDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLabelAssign} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog
        open={reminderDialogOpen}
        onClose={() => setReminderDialogOpen(false)}
      >
        <DialogTitle>Add reminder</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              type="date"
              label="Date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              type="time"
              label="Time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReminderDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              const reminderDateTime = new Date(
                reminderDate + "T" + reminderTime
              );
              updateNote({
                variables: {
                  noteId: parseFloat(note.id),
                  data: {
                    reminder_at: reminderDateTime.toISOString(),
                    is_reminder: true,
                  },
                },
              });
              setReminderDialogOpen(false);
            }}
            variant="contained"
          >
            Set Reminder
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NoteCard;
