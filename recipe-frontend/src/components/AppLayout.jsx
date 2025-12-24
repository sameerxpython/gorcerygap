import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Kitchen as PantryIcon,
    MenuBook as RecipeIcon,
    ShoppingCart as GroceryIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/app/dashboard' },
    { text: 'My Pantry', icon: <PantryIcon />, path: '/app/pantry' },
    { text: 'Recipes', icon: <RecipeIcon />, path: '/app/recipes' },
    { text: 'Grocery List', icon: <GroceryIcon />, path: '/app/grocery' },
];

export default function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
    };

    const handleNavigate = (path) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const drawerContent = (
        <div>
            <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PantryIcon sx={{ mr: 1 }} />
                    GroceryGap
                </Typography>
            </Toolbar>
            <Divider />
            <List sx={{ px: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={location.pathname === item.path || location.pathname.startsWith(item.path)}
                            onClick={() => handleNavigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.contrastText',
                                    '&:hover': {
                                        backgroundColor: 'primary.main',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.contrastText',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'inherit' : 'text.secondary' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 'medium' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <List sx={{ px: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleNavigate('/app/settings')} sx={{ borderRadius: 2 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
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
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {user?.name || 'User'}
                        </Typography>
                        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                            <Avatar alt={user?.name} src="/static/images/avatar/2.jpg">
                                {user?.name?.charAt(0) || <PersonIcon />}
                            </Avatar>
                        </IconButton>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => { handleNavigate('/app/settings'); handleMenuClose(); }}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', mt: 8 }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
