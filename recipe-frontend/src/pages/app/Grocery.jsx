import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Checkbox,
    Paper,
    IconButton,
    Divider,
    CircularProgress
} from '@mui/material';
import {
    ShoppingBasket as ShoppingBasketIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { getGroceryLists, generateGroceryList, updateGroceryItem, deleteGroceryList } from '../../api/grocery';

export default function Grocery() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const { data: lists, isLoading } = useQuery({
        queryKey: ['groceryLists'],
        queryFn: getGroceryLists,
    });

    const generateMutation = useMutation({
        mutationFn: generateGroceryList,
        onSuccess: () => {
            queryClient.invalidateQueries(['groceryLists']);
            enqueueSnackbar('Grocery list generated!', { variant: 'success' });
        },
        onError: () => {
            enqueueSnackbar('Failed to generate list', { variant: 'error' });
        }
    });

    const toggleItemMutation = useMutation({
        mutationFn: updateGroceryItem,
        onSuccess: () => {
            queryClient.invalidateQueries(['groceryLists']);
        },
    });

    const deleteListMutation = useMutation({
        mutationFn: deleteGroceryList,
        onSuccess: () => {
            queryClient.invalidateQueries(['groceryLists']);
            enqueueSnackbar('List deleted', { variant: 'success' });
        }
    });

    if (isLoading) return <Typography>Loading...</Typography>;

    const activeList = lists?.find(l => l.status === 'active') || lists?.[0];

    const handleToggle = (listId, itemId, currentStatus) => {
        toggleItemMutation.mutate({
            listId,
            itemId,
            updates: { isPurchased: !currentStatus }
        });
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">Grocery List</Typography>
                <Button
                    variant="contained"
                    startIcon={generateMutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
                    onClick={() => generateMutation.mutate()}
                    disabled={generateMutation.isPending}
                >
                    Generate New List
                </Button>
            </Box>

            {!activeList ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary" mb={2}>No active grocery list.</Typography>
                    <Button variant="outlined" onClick={() => generateMutation.mutate()}>Generate from Pantry & Recipes</Button>
                </Paper>
            ) : (
                <Paper sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">{activeList.name} ({activeList.items.filter(i => !i.isPurchased).length} items left)</Typography>
                        <IconButton color="error" onClick={() => { if (window.confirm('Delete this list?')) deleteListMutation.mutate(activeList._id) }}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                    <Divider />
                    <List>
                        {activeList.items.map((item) => (
                            <ListItem key={item._id} dense disablePadding>
                                <ListItemButton onClick={() => handleToggle(activeList._id, item._id, item.isPurchased)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={item.isPurchased}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.name}
                                        secondary={item.quantity ? `${item.quantity} ${item.unit || ''}` : null}
                                        sx={{
                                            textDecoration: item.isPurchased ? 'line-through' : 'none',
                                            color: item.isPurchased ? 'text.disabled' : 'text.primary'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        {activeList.items.length === 0 && (
                            <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>List is empty.</Typography>
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
}
