import React, { useState, useEffect } from 'react';
import { fetchRecipes } from '../api';
import RecipeCard from '../components/RecipeCard';

export default function HomePage() {
    const [recipes, setRecipes]   = useState([]);
    const [query, setQuery]       = useState('');
    const [sort, setSort]         = useState('rating');
    const [loading, setLoading]   = useState(false);
    const [skip, setSkip]         = useState(0);
    const [hasMore, setHasMore]   = useState(false);
    const limit = 10;

    // Загрузка карточек
    const loadRecipes = async () => {
        setLoading(true);
        try {
            const { data } = await fetchRecipes({ skip, limit, query, sort });
            setRecipes(prev => skip === 0 ? data : [...prev, ...data]);
            // Если пришло ровно limit элементов — есть, что догружать
            setHasMore(data.length === limit);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Когда меняется skip (или можно добавить query/sort), грузим снова
    useEffect(() => { loadRecipes(); }, [skip]);

    const onSearch = e => {
        e.preventDefault();
        setSkip(0);  // сбросим пагинацию
    };
    const loadMore = () => setSkip(prev => prev + limit);

    return (
        <div className="pt-5 mt-4">
            <div className="container">
                <h1 className="text-center mb-5" style={{color: "aliceblue"}}>Кулинарная соцсеть</h1>

                <div className="d-flex justify-content-center mb-5">
                    <form onSubmit={onSearch} className="row g-2 w-100" style={{ maxWidth: '800px' }}>
                        <div className="col-12 col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Поиск рецептов..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                        </div>
                        <div className="col-6 col-md-3">
                            <select
                                className="form-select"
                                value={sort}
                                onChange={e => setSort(e.target.value)}
                            >
                                <option value="rating">По рейтингу</option>
                                <option value="date">По дате</option>
                            </select>
                        </div>
                        <div className="col-6 col-md-3">
                            <button className="btn btn-primary w-100" type="submit">
                                Найти
                            </button>
                        </div>
                    </form>
                </div>

                {loading && skip === 0 ? (
                    <p className="text-center text-muted">Загрузка…</p>
                ) : (
                    <div className="row justify-content-center g-4">
                        {recipes.map(r => (
                            <div key={r.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <RecipeCard recipe={r} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Кнопка «Загрузить ещё» если ещё есть */}
                {!loading && hasMore && (
                    <div className="d-flex justify-content-center my-5">
                        <button className="btn btn-success" onClick={loadMore}>
                            Загрузить ещё
                        </button>
                    </div>
                )}

                {/* Индикатор дозагрузки */}
                {loading && skip > 0 && (
                    <p className="text-center text-muted mt-3">Загрузка ещё…</p>
                )}
            </div>
        </div>
    );
}
