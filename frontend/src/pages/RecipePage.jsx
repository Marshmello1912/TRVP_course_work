// src/pages/RecipePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate} from 'react-router-dom';
import {
    fetchRecipe,
    rateRecipe,
    commentRecipe,
    deleteRecipe,
    addFavorite,
    removeFavorite,
    fetchFavorites
} from '../api';
import { AuthContext } from '../context/AuthContext';
import MediaGallery from '../components/MediaGallery';
import RatingControls from '../components/RatingControls';
import CommentSection from '../components/CommentSection';

export default function RecipePage() {

    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [recipe, setRecipe] = useState(null);
    const navigate = useNavigate();

    const [isFav, setIsFav] = useState(false);
    const [loadingFav, setLoadingFav] = useState(true);


    const loadRecipe = async () => {
        try {
            const { data } = await fetchRecipe(id);
            setRecipe(data);
        } catch (e) {
            console.error(e);
        }
    };

    const loadFavStatus = async () => {
        if (!user) {
            setIsFav(false);
            setLoadingFav(false);
            return;
        }
        try {
            const { data } = await fetchFavorites();
            setIsFav(data.some(r => r.id === recipe?.id));
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingFav(false);
        }
    };
    useEffect(() => {
        loadRecipe();
    }, [id]);

    // Как только рецепт подтянулся, проверяем isFav
    useEffect(() => {
        loadFavStatus();
    }, [recipe, user]);

    const onRate = async score => {
        await rateRecipe(id, score);
        loadRecipe();
    };
    const onComment = async text => {
        await commentRecipe(id, text);
        loadRecipe();
    };

    // Обработчик удаления
    const handleDelete = async () => {
        if (!window.confirm('Вы действительно хотите удалить этот рецепт?')) return;
        try {
            await deleteRecipe(id);
            // После удаления — возвращаемся на главную
            navigate('/');
        } catch (e) {
            console.error(e);
            alert('Не удалось удалить рецепт');
        }
    };

    const toggleFav = async () => {
        try {
            if (isFav) {
                await removeFavorite(id);
                setIsFav(false);
            } else {
                await addFavorite(id);
                setIsFav(true);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!recipe) {
        return <p className="pt-5 text-center">Загрузка…</p>;
    }

    const isAuthor = user && user.id === recipe.author_id;

    return (
        <div className="container pt-5 mt-5 mb-5">
            {/* Навигация */}
            <div className="mb-3">
                <Link to="/" className="me-3">← Главная</Link>
                <Link to={`/users/${recipe.author_id}`}>@Пользователь{recipe.author_id}</Link>
            </div>

            {/* Заголовок */}
            <h1 className="mb-3">{recipe.title}</h1>

            {/* Кнопка «Статистика» только для автора */}
            {isAuthor && (
                <div className="mb-4">
                    <Link
                        to={`/recipes/${id}/stats`}
                        className="btn btn-info"
                    >
                        Посмотреть статистику
                    </Link>
                    <button
                        className="btn btn-danger"
                        onClick={handleDelete}>
                        Удалить рецепт
                </button>
                </div>
            )}
            {/* Кнопка «Избранное» */}
            {!isAuthor && user && !loadingFav && (
                <div className="mb-4">
                    <button
                        className={isFav ? 'btn btn-warning' : 'btn btn-outline-warning'}
                        onClick={toggleFav}
                    >
                        {isFav ? 'Удалить из избранного' : 'В избранное'}
                    </button>
                </div>
            )}
            {isAuthor && (
                <div className="mb-3">
                    <Link to={`/recipes/${recipe.id}/edit`} className="btn btn-warning me-2">
                        ✏️ Редактировать
                    </Link>
                </div>
            )}

            {/* Описание */}
            <p className="lead">{recipe.description}</p>

            {/* Медиа */}
            <MediaGallery media={recipe.media} />

            {/* Ингредиенты */}
            <section className="mt-4">
                <h4>Ингредиенты</h4>
                <ul className="list-group">
                    {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="list-group-item">{ing}</li>
                    ))}
                </ul>
            </section>

            {/* Шаги приготовления */}
            <section className="mt-4">
                <h4>Шаги приготовления</h4>
                <ol className="list-group list-group-numbered">
                    {recipe.steps.map((step, i) => (
                        <li key={i} className="list-group-item">{step}</li>
                    ))}
                </ol>
            </section>

            {/* Кнопки оценки */}
            <div className="mt-4 mb-4">
                <RatingControls
                    rating={recipe.rating}
                    onRate={onRate}
                />
            </div>

            {/* Комментарии */}
            <CommentSection
                comments={recipe.comments}
                onComment={onComment}
            />
        </div>
    );
}
