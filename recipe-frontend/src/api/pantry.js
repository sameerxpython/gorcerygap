import api from './axios';

export const getPantryItems = async () => {
    const { data } = await api.get('/pantry');
    return data;
};

export const addPantryItem = async (item) => {
    const { data } = await api.post('/pantry', item);
    return data;
};

export const updatePantryItem = async ({ id, ...updates }) => {
    const { data } = await api.put(`/pantry/${id}`, updates);
    return data;
};

export const deletePantryItem = async (id) => {
    const { data } = await api.delete(`/pantry/${id}`);
    return data;
};
