import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Typography,
    Button,
    Paper,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Grid,
    Card,
    CardContent,
    CardActions,
    Fab,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getPantryItems, addPantryItem, updatePantryItem, deletePantryItem } from '../../api/pantry';
import { format, isBefore, addDays } from 'date-fns';

export default function Pantry() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const { data: pantryItems, isLoading, isError } = useQuery({
        queryKey: ['pantryItems'],
        queryFn: getPantryItems,
    });

    const createMutation = useMutation({
        mutationFn: addPantryItem,
        onSuccess: () => {
            queryClient.invalidateQueries(['pantryItems']);
            enqueueSnackbar('Item added to pantry', { variant: 'success' });
            handleClose();
        },
        onError: () => {
            enqueueSnackbar('Failed to add item', { variant: 'error' });
        }
    });

    const updateMutation = useMutation({
        mutationFn: updatePantryItem,
        onSuccess: () => {
            queryClient.invalidateQueries(['pantryItems']);
            enqueueSnackbar('Item updated', { variant: 'success' });
            handleClose();
        },
        onError: () => {
            enqueueSnackbar('Failed to update item', { variant: 'error' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deletePantryItem,
        onSuccess: () => {
            queryClient.invalidateQueries(['pantryItems']);
            enqueueSnackbar('Item removed', { variant: 'success' });
        },
        onError: () => {
            enqueueSnackbar('Failed to remove item', { variant: 'error' });
        }
    });

    const handleOpen = (item = null) => {
        setEditItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditItem(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteMutation.mutate(id);
        }
    };

    const PantryForm = () => {
        const formik = useFormik({
            initialValues: {
                name: editItem ? editItem.name : '',
                quantity: editItem ? editItem.quantity : 1,
                unit: editItem ? editItem.unit : '',
                category: editItem ? editItem.category : 'General',
                expiryDate: editItem?.expiryDate ? editItem.expiryDate.split('T')[0] : '',
            },
            validationSchema: Yup.object({
                name: Yup.string().required('Required'),
                quantity: Yup.number().positive().required('Required'),
            }),
            onSubmit: (values) => {
                if (editItem) {
                    updateMutation.mutate({ id: editItem._id, ...values });
                } else {
                    createMutation.mutate(values);
                }
            }
        });

        return (
            <form id="pantry-form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" name="name" label="Item Name"
                    value={formik.values.name} onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <TextField
                            fullWidth margin="dense" name="quantity" label="Quantity" type="number"
                            value={formik.values.quantity} onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            fullWidth margin="dense" name="unit" label="Unit (e.g. kg, pcs)"
                            value={formik.values.unit} onChange={formik.handleChange}
                        />
                    </Grid>
                </Grid>
                <TextField
                    fullWidth margin="dense" name="category" label="Category" select
                    value={formik.values.category} onChange={formik.handleChange}
                >
                    {['Produce', 'Dairy', 'Meat', 'Pantry', 'Spices', 'General'].map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth margin="dense" name="expiryDate" label="Expiry Date" type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.expiryDate} onChange={formik.handleChange}
                />
            </form>
        );
    };

    if (isLoading) return <Typography>Loading Pantry...</Typography>;
    if (isError) return <Typography>Error loading pantry.</Typography>;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">My Pantry</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                    Add Item
                </Button>
            </Box>

            <Grid container spacing={3}>
                {pantryItems?.map((item) => {
                    const isExpired = item.expiryDate && isBefore(new Date(item.expiryDate), new Date());
                    const isExpiringSoon = item.expiryDate && isBefore(new Date(item.expiryDate), addDays(new Date(), 3));

                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
                            <Card sx={{
                                position: 'relative',
                                borderLeft: isExpired ? '6px solid #ef4444' : isExpiringSoon ? '6px solid #f59e0b' : '6px solid #22c55e'
                            }}>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {item.name}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {item.quantity} {item.unit} • {item.category}
                                    </Typography>
                                    {item.expiryDate && (
                                        <Chip
                                            label={isExpired ? "Expired" : `Expires ${format(new Date(item.expiryDate), 'MMM d')}`}
                                            color={isExpired ? "error" : isExpiringSoon ? "warning" : "default"}
                                            size="small"
                                        />
                                    )}
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton size="small" onClick={() => handleOpen(item)}><EditIcon /></IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(item._id)} color="error"><DeleteIcon /></IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                <DialogContent>
                    <PantryForm />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" form="pantry-form" variant="contained">{editItem ? 'Update' : 'Add'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
