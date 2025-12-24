import React from 'react';
import { Box, Typography, Paper, Button, Avatar, Divider } from '@mui/material';
import { Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
    const { user, logout } = useAuth();

    return (
        <Box maxWidth="sm" mx="auto">
            <Typography variant="h4" fontWeight="bold" mb={3}>Settings</Typography>

            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Avatar
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: 40 }}
                    src="/static/images/avatar/2.jpg"
                >
                    {user?.name?.charAt(0) || <PersonIcon />}
                </Avatar>
                <Typography variant="h5" fontWeight="bold">{user?.name || 'User Name'}</Typography>
                <Typography color="text.secondary" mb={3}>{user?.email || 'user@example.com'}</Typography>

                <Divider sx={{ my: 3 }} />

                <Box display="flex" flexDirection="column" gap={2}>
                    <Button variant="outlined" color="primary" fullWidth>
                        Edit Profile (Coming Soon)
                    </Button>
                    <Button variant="contained" color="error" startIcon={<LogoutIcon />} onClick={logout} fullWidth>
                        Logout
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
