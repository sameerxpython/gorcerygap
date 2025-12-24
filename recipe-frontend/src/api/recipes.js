import api from './axios';

export const getRecipes = async (params) => {
    const { data } = await api.get('/recipes', { params });
    return data;
};

export const getRecipeById = async (id) => {
    const { data } = await api.get(`/recipes/${id}`);
    return data;
};

export const createRecipe = async (recipe) => {
    const { data } = await api.post('/recipes', recipe);
    return data;
};

export const updateRecipe = async ({ id, ...updates }) => {
    const { data } = await api.put(`/recipes/${id}`, updates);
    return data;
};

export const deleteRecipe = async (id) => {
    const { data } = await api.delete(`/recipes/${id}`);
    return data;
};
