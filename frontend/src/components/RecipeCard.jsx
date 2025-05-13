import React from 'react';
import { Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function RecipeCard({ recipe }) {
    const img = recipe.media.find(m => m.media_type === 'image');

    return (
        <div className="col">
            <div className="card h-100 shadow-sm">
                {img ? (
                    <img
                        src={`${API_URL}${img.url}`}
                        className="card-img-top"
                        alt={recipe.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                    />
                ) : (
                    <img
                        src={`${API_URL}/uploads/Errors/NoImage.jpg`}
                        className="card-img-top"
                        alt={recipe.title}
                        style={{height: '200px', objectFit: 'cover'}}
                    />
                )}
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{recipe.title}</h5>
                    <p className="card-text mt-auto">Рейтинг: {recipe.rating.toFixed(1)}</p>
                    <Link to={`/recipes/${recipe.id}`} className="stretched-link" />
                </div>
            </div>
        </div>
    );
}
