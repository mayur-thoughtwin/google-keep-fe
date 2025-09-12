import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Apps as AppsIcon,
  AccountCircle,
  LightbulbOutlined,
  ArchiveOutlined,
  DeleteOutlined,
  LabelOutlined,
  SettingsOutlined,
  FeedbackOutlined,
  DarkModeOutlined,
  LightModeOutlined,
  Add as AddIcon,
} from '@mui/icons-material';
import { GET_ME, GET_SETTINGS, GET_LABELS } from '../graphql/queries';
import { UPDATE_SETTINGS } from '../graphql/mutations';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';

const drawerWidth = 280;

// eslint-disable-next-line no-unused-vars
const Layout = ({ children, onRefresh, onSearch, onViewToggle, viewMode, onAddNote }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('notes');
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const location = useLocation();

  const { data: userData } = useQuery(GET_ME);
  const { data: settingsData } = useQuery(GET_SETTINGS);
  const { data: labelsData } = useQuery(GET_LABELS);
  const [updateSettings] = useMutation(UPDATE_SETTINGS);

  const user = userData?.me;
  const settings = settingsData?.getSettings?.settings;
  const labels = labelsData?.getLabels?.data || [];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('google_token');
    navigate('/');
  };

  const handleThemeToggle = async () => {
    try {
      await updateSettings({
        variables: {
          settings: {
            is_dark_theme: !settings?.is_dark_theme,
          },
        },
      });
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    navigate(`/${view}`);
  };

  const sidebarItems = [
    { text: 'Notes', icon: <LightbulbOutlined />, view: 'notes' },
    { text: 'Reminders', icon: <LightbulbOutlined />, view: 'reminders' },
    { text: 'Archive', icon: <ArchiveOutlined />, view: 'archive' },
    { text: 'Trash', icon: <DeleteOutlined />, view: 'trash' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          Keep
        </Typography>
      </Toolbar>
      <Divider />
      
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={currentView === item.view}
              onClick={() => handleViewChange(item.view)}
              sx={{
                borderRadius: '0 25px 25px 0',
                marginRight: 1,
                '&.Mui-selected': {
                  backgroundColor: '#feefc3',
                  '&:hover': {
                    backgroundColor: '#feefc3',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      <List>
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Labels
        </Typography>
        {labels.map((label, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              sx={{
                borderRadius: '0 25px 25px 0',
                marginRight: 1,
                pl: 4,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LabelOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={label.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/settings')}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SettingsOutlined />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <FeedbackOutlined />
              </ListItemIcon>
              <ListItemText primary="Send feedback" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'black',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img
              src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png"
              alt="Keep"
              style={{ width: 40, height: 40, marginRight: 16 }}
            />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
              Keep
            </Typography>
          </Box>

          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              flexGrow: 1,
              maxWidth: 600,
              mx: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                backgroundColor: '#f1f3f4',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={viewMode === 'grid' ? 'List view' : 'Grid view'}>
              <IconButton onClick={onViewToggle}>
                {viewMode === 'grid' ? <ListIcon /> : <GridIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Google apps">
              <IconButton>
                <AppsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Theme">
              <IconButton onClick={handleThemeToggle}>
                {settings?.is_dark_theme ? <LightModeOutlined /> : <DarkModeOutlined />}
              </IconButton>
            </Tooltip>

            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar
                src={user?.picture}
                alt={user?.name}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <AccountCircle sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: settings?.is_dark_theme ? '#202124' : '#fafafa',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
