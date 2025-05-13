import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUserRecipes } from '../api';
import RecipeCard from '../components/RecipeCard';

export default function UserPage() {
    const { id } = useParams();
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await fetchUserRecipes(id);
            setRecipes(data);
        })();
    }, [id]);

    return (
        <div className="container pt-5 mt-5 mb-5">
            <Link to="/" className="d-block mb-3">← Главная</Link>
            <h1 className="mb-4">Рецепты пользователя #{id}</h1>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
            </div>
        </div>
    );
}
