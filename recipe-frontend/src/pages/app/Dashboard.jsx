import React from 'react';
import { Box, Typography, Grid, Paper, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Kitchen as PantryIcon,
    MenuBook as RecipeIcon,
    ShoppingBasket as GroceryIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getPantryItems } from '../../api/pantry';
import { getRecipes } from '../../api/recipes';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useTheme();

    const { data: pantryItems } = useQuery({ queryKey: ['pantryItems'], queryFn: getPantryItems });
    const { data: recipes } = useQuery({ queryKey: ['recipes'], queryFn: () => getRecipes({}) });

    const lowStockItems = pantryItems?.filter(item => item.quantity < 2) || [];
    const expiringItems = pantryItems?.filter(item => {
        if (!item.expiryDate) return false;
        const expiry = new Date(item.expiryDate);
        const today = new Date();
        const warningDate = new Date();
        warningDate.setDate(today.getDate() + 3);
        return expiry < warningDate;
    }) || [];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const StatCard = ({ title, count, icon, color, onClick, delay }) => (
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'white',
                    transition: 'border-color 0.2s',
                    '&:hover': {
                        borderColor: `${color}.main`,
                        boxShadow: `0 4px 20px 0 ${theme.palette[color].main}20`
                    }
                }}
                onClick={onClick}
            >
                <Box>
                    <Typography color="text.secondary" variant="subtitle2" fontWeight="600" letterSpacing={0.5}>
                        {title.toUpperCase()}
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: 'text.primary' }}>
                        {count}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: (theme) => `linear-gradient(135deg, ${theme.palette[color].light}20 0%, ${theme.palette[color].main}20 100%)`,
                        color: `${color}.main`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {React.cloneElement(icon, { fontSize: 'large' })}
                </Box>
            </Paper>
        </motion.div>
    );

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Box mb={5}>
                <Typography variant="h3" fontWeight="800" gutterBottom sx={{ background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', width: 'fit-content' }}>
                    Hello, {user?.name?.split(' ')[0] || 'Chef'}!
                </Typography>
                <Typography variant="h6" color="text.secondary" fontWeight="400">
                    Let's create something delicious today.
                </Typography>
            </Box>

            <Grid container spacing={3} mb={5}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Pantry Items" count={pantryItems?.length || 0} icon={<PantryIcon />} color="primary" onClick={() => navigate('/app/pantry')} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Saved Recipes" count={recipes?.length || 0} icon={<RecipeIcon />} color="secondary" onClick={() => navigate('/app/recipes')} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Low Stock" count={lowStockItems.length} icon={<GroceryIcon />} color="warning" onClick={() => navigate('/app/grocery')} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Expiring Soon" count={expiringItems.length} icon={<PantryIcon />} color="error" onClick={() => navigate('/app/pantry')} />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography variant="h5" fontWeight="bold" mb={3}>Quick Actions</Typography>
                            <Box display="flex" gap={2} flexWrap="wrap">
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<PantryIcon />}
                                    onClick={() => navigate('/app/pantry')}
                                    sx={{ py: 1.5, px: 3 }}
                                >
                                    Update Pantry
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<RecipeIcon />}
                                    onClick={() => navigate('/app/recipes/new')}
                                    sx={{ py: 1.5, px: 3, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                                >
                                    Add New Recipe
                                </Button>
                            </Box>
                        </Box>
                        {/* Decorative background circle */}
                        <Box sx={{
                            position: 'absolute',
                            top: -100,
                            right: -50,
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.secondary.light}20 100%)`,
                            pointerEvents: 'none'
                        }} />
                    </Paper>
                </Grid>
            </Grid>
        </motion.div>
    );
}
