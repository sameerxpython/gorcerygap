import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Typography,
    Button,
    Grid,
    TextField,
    MenuItem,
    Card,
    CardContent,
    CardActionArea,
    Chip,
    InputAdornment,
    Paper
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Restaurant as RestaurantIcon,
    Timer as TimerIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getRecipes } from '../../api/recipes';

const RecipePlaceholder = () => (
    <Box sx={{ height: 140, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RestaurantIcon sx={{ fontSize: 60, color: 'grey.400' }} />
    </Box>
);

export default function Recipes() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState('');

    const { data: recipes, isLoading, isError, error } = useQuery({
        queryKey: ['recipes', search, difficulty],
        queryFn: () => getRecipes({ ingredient: search, difficulty }),
    });

    if (isError) {
        return (
            <Box p={3}>
                <Typography color="error" variant="h6">Error loading recipes</Typography>
                <Typography color="text.secondary">{error?.message || 'Unknown error'}</Typography>
                <Button onClick={() => window.location.reload()} sx={{ mt: 2 }} variant="outlined">Retry</Button>
            </Box>
        );
    }

    const safeRecipes = Array.isArray(recipes) ? recipes : [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">Recipes</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/app/recipes/new')}
                >
                    New Recipe
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }} elevation={0} variant="outlined">
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <TextField
                            fullWidth
                            placeholder="Search by title or ingredient..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            select
                            label="Difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Easy">Easy</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Hard">Hard</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            {isLoading ? (
                <Typography>Loading Recipes...</Typography>
            ) : (
                <Grid container spacing={3}>
                    {safeRecipes.map((recipe, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={recipe?._id || index}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardActionArea onClick={() => navigate(`/app/recipes/${recipe?._id}`)}>
                                    <RecipePlaceholder />
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom noWrap>{recipe?.title || 'Untitled'}</Typography>
                                        <Box display="flex" gap={1} mb={1}>
                                            <Chip label={recipe?.difficulty || 'Easy'} size="small" color={recipe?.difficulty === 'Easy' ? 'success' : recipe?.difficulty === 'Medium' ? 'warning' : 'error'} />
                                            {(recipe?.cookTimeMinutes || 0) > 0 && (
                                                <Chip icon={<TimerIcon />} label={`${recipe.cookTimeMinutes} min`} size="small" variant="outlined" />
                                            )}
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {recipe?.ingredients?.length || 0} ingredients
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                    {safeRecipes.length === 0 && (
                        <Grid size={12}>
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>No recipes found</Typography>
                                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate('/app/recipes/new')}>
                                    Create one now
                                </Button>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );
}
