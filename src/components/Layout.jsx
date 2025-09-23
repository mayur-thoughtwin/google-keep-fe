import React, { useState, useEffect, useRef } from 'react';
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
  Divider,
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
  LockClock,
} from '@mui/icons-material';
import { GET_ME, GET_SETTINGS, GET_LABELS } from '../graphql/queries';
import { UPDATE_SETTINGS } from '../graphql/mutations';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import debounce from 'lodash/debounce';

const drawerWidth = 280;

const Layout = ({ children, onRefresh, onSearch, onViewToggle, viewMode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { data: userData } = useQuery(GET_ME);
  const { data: settingsData } = useQuery(GET_SETTINGS);
  const { data: labelsData } = useQuery(GET_LABELS);
  const [updateSettings] = useMutation(UPDATE_SETTINGS);

  const user = userData?.me;
  const settings = settingsData?.getSettings?.settings;
  const labels = labelsData?.getLabels?.data || [];

  const currentView = location.pathname.split('/').pop();

  // Debounced search function
  const debouncedSearch = useRef(
    debounce((query) => {
      onSearch(query);
    }, 1000)
  ).current;

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value); // local state keeps input stable
    debouncedSearch(value); // debounced API call
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('google_token');
    navigate('/');
  };

  const handleThemeToggle = async () => {
    try {
      await updateSettings({
        variables: { settings: { is_dark_theme: !settings?.is_dark_theme } },
      });
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const handleViewChange = (view) => navigate(`/home/${view}`);

  const sidebarItems = [
    { text: 'Notes', icon: <LightbulbOutlined />, view: 'notes' },
    { text: 'Reminders', icon: <LockClock />, view: 'reminders' },
    { text: 'Archive', icon: <ArchiveOutlined />, view: 'archive' },
    { text: 'Trash', icon: <DeleteOutlined />, view: 'trash' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <img
          src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png"
          alt="Keep"
          style={{ width: 44, height: 44, marginRight: 18 }}
        />
        <Typography variant="h6" noWrap sx={{ color: '#5f6368' }}>
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
                  backgroundColor: '#feefc3 !important',
                  '&:hover': { backgroundColor: '#feefc3 !important' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <List>
        <Typography
          variant="subtitle2"
          sx={{ px: 2, py: 1, color: 'text.secondary' }}
        >
          Labels
        </Typography>
        {labels.map((label) => (
          <ListItem key={label.id} disablePadding>
            <ListItemButton
              sx={{ borderRadius: '0 25px 25px 0', marginRight: 1, pl: 4 }}
              onClick={() => navigate(`/home/labels/${label.id}`)}
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
            <ListItemButton onClick={() => navigate('/home/settings')}>
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
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        background: settings?.is_dark_theme ? '#222' : '#f5f5f5',
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: settings?.is_dark_theme ? '#333' : '#fff',
          color: settings?.is_dark_theme ? '#fff' : '#222',
          zIndex: 2,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Fixed search input */}
          <TextField
            placeholder="Search notes..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              flexGrow: 10,
              maxWidth: 900,
              mx: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                background: settings?.is_dark_theme ? '#444' : '#f9f9f9',
                '& fieldset': { border: 'none' },
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
                sx={{ width: 36, height: 36 }}
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
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              background: settings?.is_dark_theme ? '#222' : '#fff',
            },
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
          p: { xs: 1, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 10,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
