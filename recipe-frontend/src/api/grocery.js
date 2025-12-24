import api from './axios';

export const getGroceryLists = async () => {
    const { data } = await api.get('/grocery');
    return data;
};

export const generateGroceryList = async () => {
    const { data } = await api.post('/grocery/generate', {});
    return data;
};

export const updateGroceryList = async ({ id, ...updates }) => {
    const { data } = await api.put(`/grocery/${id}`, updates);
    return data;
};

export const updateGroceryItem = async ({ listId, itemId, updates }) => {
    const { data } = await api.patch(`/grocery/${listId}/items/${itemId}`, updates);
    return data;
};

export const deleteGroceryList = async (id) => {
    const { data } = await api.delete(`/grocery/${id}`);
    return data;
};
