import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Button,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_SETTINGS, GET_LABELS } from '../graphql/queries';
import { UPDATE_SETTINGS, ADD_LABEL, UPDATE_LABEL, DELETE_LABEL } from '../graphql/mutations';
import Layout from '../components/Layout';

const Settings = () => {
  const [settings, setSettings] = useState({
    is_new_item_at_bottom: false,
    is_display_rich: true,
    is_checked_item_at_bottom: false,
    is_dark_theme: false,
    is_sharing: false,
  });
  const [labelDialogOpen, setLabelDialogOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [labelName, setLabelName] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: settingsData, loading: settingsLoading } = useQuery(GET_SETTINGS);
  const { data: labelsData, loading: labelsLoading, refetch: refetchLabels } = useQuery(GET_LABELS);
  const [updateSettings] = useMutation(UPDATE_SETTINGS);
  const [addLabel] = useMutation(ADD_LABEL, {
    refetchQueries: [{ query: GET_LABELS }],
  });
  const [updateLabel] = useMutation(UPDATE_LABEL, {
    refetchQueries: [{ query: GET_LABELS }],
  });
  const [deleteLabel] = useMutation(DELETE_LABEL, {
    refetchQueries: [{ query: GET_LABELS }],
  });

  const labels = labelsData?.getLabels?.data || [];

  React.useEffect(() => {
    if (settingsData?.getSettings?.settings) {
      setSettings(settingsData.getSettings.settings);
    }
  }, [settingsData]);

  const handleSettingChange = async (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    setSaving(true);

    try {
      await updateSettings({
        variables: {
          settings: { [setting]: value },
        },
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      // Revert on error
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  const handleAddLabel = async () => {
    if (!labelName.trim()) return;

    try {
      await addLabel({
        variables: {
          label: { name: labelName.trim() },
        },
      });
      setLabelName('');
      setLabelDialogOpen(false);
    } catch (error) {
      console.error('Error adding label:', error);
    }
  };

  const handleEditLabel = (label) => {
    setEditingLabel(label);
    setLabelName(label.name);
    setLabelDialogOpen(true);
  };

  const handleUpdateLabel = async () => {
    if (!labelName.trim() || !editingLabel) return;

    try {
      await updateLabel({
        variables: {
          labelId: parseFloat(editingLabel.id),
          data: { name: labelName.trim() },
        },
      });
      setLabelName('');
      setEditingLabel(null);
      setLabelDialogOpen(false);
    } catch (error) {
      console.error('Error updating label:', error);
    }
  };

  const handleDeleteLabel = async (label) => {
    if (window.confirm(`Delete label "${label.name}"?`)) {
      try {
        await deleteLabel({
          variables: {
            labelId: parseFloat(label.id),
          },
        });
      } catch (error) {
        console.error('Error deleting label:', error);
      }
    }
  };

  const handleLabelDialogClose = () => {
    setLabelDialogOpen(false);
    setEditingLabel(null);
    setLabelName('');
  };

  if (settingsLoading || labelsLoading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 500 }}>
          Settings
        </Typography>

        {/* General Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              General
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.is_dark_theme}
                    onChange={(e) => handleSettingChange('is_dark_theme', e.target.checked)}
                    disabled={saving}
                  />
                }
                label="Dark theme"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.is_display_rich}
                    onChange={(e) => handleSettingChange('is_display_rich', e.target.checked)}
                    disabled={saving}
                  />
                }
                label="Rich text formatting"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.is_new_item_at_bottom}
                    onChange={(e) => handleSettingChange('is_new_item_at_bottom', e.target.checked)}
                    disabled={saving}
                  />
                }
                label="New items at bottom"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.is_checked_item_at_bottom}
                    onChange={(e) => handleSettingChange('is_checked_item_at_bottom', e.target.checked)}
                    disabled={saving}
                  />
                }
                label="Checked items at bottom"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.is_sharing}
                    onChange={(e) => handleSettingChange('is_sharing', e.target.checked)}
                    disabled={saving}
                  />
                }
                label="Enable sharing"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Labels Management */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Labels
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setLabelDialogOpen(true)}
              >
                Add Label
              </Button>
            </Box>

            {labels.length === 0 ? (
              <Typography color="text.secondary">
                No labels yet. Create your first label to organize your notes.
              </Typography>
            ) : (
              <List>
                {labels.map((label, index) => (
                  <React.Fragment key={label.id || index}>
                    <ListItem>
                      <ListItemText primary={label.name} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleEditLabel(label)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteLabel(label)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < labels.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Label Dialog */}
        <Dialog open={labelDialogOpen} onClose={handleLabelDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingLabel ? 'Edit Label' : 'Add Label'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Label name"
              fullWidth
              variant="outlined"
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  editingLabel ? handleUpdateLabel() : handleAddLabel();
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLabelDialogClose}>Cancel</Button>
            <Button
              onClick={editingLabel ? handleUpdateLabel : handleAddLabel}
              variant="contained"
              disabled={!labelName.trim()}
            >
              {editingLabel ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Settings;
