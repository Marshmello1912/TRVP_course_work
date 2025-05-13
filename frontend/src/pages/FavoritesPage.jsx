import React, { useState, useEffect } from 'react';
import { fetchFavorites } from '../api';
import RecipeCard from '../components/RecipeCard';

export default function FavoritesPage() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await fetchFavorites();
                setRecipes(data);
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    return (
        <div className="container pt-5 mt-5 mb-5">
            <h1 className="text-center mb-5">Избранные рецепты</h1>
            {recipes.length === 0 ? (
                <p className="text-center text-muted">У вас пока нет избранных рецептов</p>
            ) : (
                <div className="row justify-content-center g-4">
                    {recipes.map(r => (
                        <div key={r.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <RecipeCard recipe={r} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
