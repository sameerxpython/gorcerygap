import React from 'react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    IconButton,
    MenuItem,
    Divider
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRecipe, getRecipeById, updateRecipe } from '../../api/recipes';
import { useSnackbar } from 'notistack';

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    difficulty: Yup.string().oneOf(['Easy', 'Medium', 'Hard']),
    cookTimeMinutes: Yup.number().min(0, 'Must be positive'),
    ingredients: Yup.array().of(
        Yup.object({
            name: Yup.string().required('Required'),
            quantity: Yup.string()
        })
    ).min(1, 'At least one ingredient is required'),
    steps: Yup.string().required('Instructions are required'),
});

export default function RecipeForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const { data: recipe, isLoading } = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => getRecipeById(id),
        enabled: isEdit,
    });

    const mutation = useMutation({
        mutationFn: isEdit ? updateRecipe : createRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries(['recipes']);
            enqueueSnackbar(`Recipe ${isEdit ? 'updated' : 'created'} successfully`, { variant: 'success' });
            navigate('/app/recipes');
        },
        onError: (err) => {
            enqueueSnackbar(err.response?.data?.message || 'Failed to save recipe', { variant: 'error' });
        }
    });

    const formik = useFormik({
        initialValues: {
            title: recipe?.title || '',
            description: recipe?.description || '',
            difficulty: recipe?.difficulty || 'Easy',
            cookTimeMinutes: recipe?.cookTimeMinutes || 15,
            ingredients: recipe?.ingredients || [{ name: '', quantity: '' }],
            steps: recipe?.steps || '',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            if (isEdit) {
                mutation.mutate({ id, ...values });
            } else {
                mutation.mutate(values);
            }
        },
    });

    if (isEdit && isLoading) return <Typography>Loading...</Typography>;

    return (
        <Box maxWidth="md" mx="auto">
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/app/recipes')} sx={{ mb: 2 }}>
                Back to Recipes
            </Button>
            <Typography variant="h4" fontWeight="bold" mb={3}>
                {isEdit ? 'Edit Recipe' : 'New Recipe'}
            </Typography>

            <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit}>
                    <Paper sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                            <Grid size={12}>
                                <TextField
                                    fullWidth label="Title" name="title"
                                    value={formik.values.title} onChange={formik.handleChange}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth label="Description" name="description" multiline rows={2}
                                    value={formik.values.description} onChange={formik.handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth select label="Difficulty" name="difficulty"
                                    value={formik.values.difficulty} onChange={formik.handleChange}
                                >
                                    {['Easy', 'Medium', 'Hard'].map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth type="number" label="Cook Time (min)" name="cookTimeMinutes"
                                    value={formik.values.cookTimeMinutes} onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Divider sx={{ my: 1 }}><Typography color="text.secondary">INGREDIENTS</Typography></Divider>
                            </Grid>

                            <FieldArray name="ingredients">
                                {({ push, remove }) => (
                                    <Grid size={12}>
                                        {formik.values.ingredients.map((item, index) => (
                                            <Box key={index} display="flex" gap={2} mb={2} alignItems="flex-start">
                                                <TextField
                                                    fullWidth size="small" label="Name"
                                                    name={`ingredients[${index}].name`}
                                                    value={item.name} onChange={formik.handleChange}
                                                    error={formik.touched.ingredients?.[index]?.name && Boolean(formik.errors.ingredients?.[index]?.name)}
                                                />
                                                <TextField
                                                    sx={{ width: 140 }} size="small" label="Qty"
                                                    name={`ingredients[${index}].quantity`}
                                                    value={item.quantity} onChange={formik.handleChange}
                                                />
                                                <IconButton color="error" onClick={() => remove(index)} disabled={formik.values.ingredients.length === 1}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        ))}
                                        <Button startIcon={<AddIcon />} size="small" onClick={() => push({ name: '', quantity: '' })}>
                                            Add Ingredient
                                        </Button>
                                    </Grid>
                                )}
                            </FieldArray>

                            <Grid size={12}>
                                <Divider sx={{ my: 1 }}><Typography color="text.secondary">INSTRUCTIONS</Typography></Divider>
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    fullWidth label="Steps" name="steps" multiline rows={6}
                                    placeholder="1. Preheat oven..."
                                    value={formik.values.steps} onChange={formik.handleChange}
                                    error={formik.touched.steps && Boolean(formik.errors.steps)}
                                    helperText={formik.touched.steps && formik.errors.steps}
                                />
                            </Grid>

                            <Grid size={12} display="flex" justifyContent="flex-end" gap={2}>
                                <Button onClick={() => navigate('/app/recipes')}>Cancel</Button>
                                <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} disabled={mutation.isPending}>
                                    Save Recipe
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </form>
            </FormikProvider>
        </Box>
    );
}
