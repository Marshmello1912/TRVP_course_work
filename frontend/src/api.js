import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    withCredentials: true,
});

export const register = data => api.post('/auth/register', data);
export const login    = data => api.post('/auth/login', data);
export const logout   = ()   => api.post('/auth/logout');
export const getCurrent = () => api.get('/auth/me');

export const fetchRecipes  = params => api.get('/recipes/', { params });
export const fetchRecipe   = id     => api.get(`/recipes/${id}`);
export const createRecipe  = data   => api.post('/recipes/', data);
export const fetchUserRecipes = userId => api.get(`/users/${userId}/recipes`);

export const uploadMedia   = (id, file, mediaType) => {
    const form = new FormData();
    form.append('media_file', file);
    form.append('media_type', mediaType);
    return api.post(`/recipes/${id}/media`, form);
};
export const rateRecipe    = (id, score) => api.post(`/recipes/${id}/rate`, { score });
export const commentRecipe = (id, content) => api.post(`/recipes/${id}/comments`, { content });
export const getRecipeStats = id => api.get(`/recipes/${id}/stats`);


// DELETE /recipes/:id
export const deleteRecipe = id => api.delete(`/recipes/${id}`);


export const addFavorite       = id => api.post(`/recipes/${id}/favorite`);
export const removeFavorite    = id => api.delete(`/recipes/${id}/favorite`);
export const fetchFavorites    = () => api.get(`/favorites`);
export const updateRecipe = (id, payload) =>
    api.put(`/recipes/${id}`, payload);

