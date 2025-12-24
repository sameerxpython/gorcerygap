import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    Stack,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon, Circle as CircleIcon } from '@mui/icons-material';
import { getRecipeById, deleteRecipe } from '../../api/recipes';
import { useSnackbar } from 'notistack';

export default function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const { data: recipe, isLoading, isError } = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => getRecipeById(id),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries(['recipes']);
            enqueueSnackbar('Recipe deleted', { variant: 'success' });
            navigate('/app/recipes');
        },
        onError: () => {
            enqueueSnackbar('Failed to delete recipe', { variant: 'error' });
        }
    });

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error loading recipe.</Typography>;

    return (
        <Box maxWidth="md" mx="auto">
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/app/recipes')} sx={{ mb: 2 }}>
                Back to List
            </Button>

            <Paper sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>{recipe.title}</Typography>
                        <Stack direction="row" spacing={1} mb={2}>
                            <Chip label={recipe.difficulty} color="primary" variant="outlined" />
                            <Chip label={`${recipe.cookTimeMinutes} mins`} />
                        </Stack>
                    </Box>
                    <Box>
                        <IconButton onClick={() => navigate(`/app/recipes/${id}/edit`)} color="primary"><EditIcon /></IconButton>
                        <IconButton onClick={handleDelete} color="error"><DeleteIcon /></IconButton>
                    </Box>
                </Box>

                <Typography variant="body1" color="text.secondary" paragraph>
                    {recipe.description}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>Ingredients</Typography>
                <List dense>
                    {recipe.ingredients.map((ing, idx) => (
                        <ListItem key={idx}>
                            <ListItemIcon sx={{ minWidth: 32 }}><CircleIcon sx={{ fontSize: 8 }} /></ListItemIcon>
                            <ListItemText primary={ing.name} secondary={ing.quantity ? `Qty: ${ing.quantity}` : null} />
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>Instructions</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {recipe.steps}
                </Typography>
            </Paper>
        </Box>
    );
}
