import React, { useState, useContext } from 'react';
import { useNavigate }                        from 'react-router-dom';
import { createRecipe, uploadMedia }          from '../api';
import { AuthContext }                        from '../context/AuthContext';

export default function CreateRecipePage() {
    const { user }      = useContext(AuthContext);
    const navigate      = useNavigate();

    // Данные формы
    const [form, setForm]         = useState({
        title:       '',
        description: '',
        ingredients: [''],
        steps:       [''],
    });
    const [error, setError]           = useState('');
    const [createdId, setCreatedId]   = useState(null);
    const [imageFile, setImageFile]   = useState(null);
    const [videoFile, setVideoFile]   = useState(null);

    // Добавление поля
    const addField = field => {
        setForm(f => ({ ...f, [field]: [...f[field], ''] }));
    };

    // Удаление поля по индексу
    const removeField = (field, idx) => {
        setForm(f => {
            const arr = [...f[field]];
            arr.splice(idx, 1);
            return { ...f, [field]: arr };
        });
    };

    // Изменение значения поля
    const handleChange = (field, idx, value) => {
        setForm(f => {
            const arr = [...f[field]];
            arr[idx] = value;
            return { ...f, [field]: arr };
        });
    };

    // Создать рецепт
    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await createRecipe(form);
            setCreatedId(data.id);
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.detail || 'Не удалось создать рецепт');
        }
    };

    // Загрузка медиа после создания
    const handleUpload = async () => {
        setError('');
        try {
            if (imageFile) await uploadMedia(createdId, imageFile, 'image');
            if (videoFile) await uploadMedia(createdId, videoFile, 'video');
            navigate(`/recipes/${createdId}`);
        } catch (e) {
            console.error(e);
            setError('Ошибка загрузки медиа');
        }
    };

    // Доступ только для авторизованных
    if (!user) {
        return <p className="pt-5 text-center text-danger">Только для авторизованных.</p>;
    }

    // Форма создания
    if (createdId === null) {
        return (
            <div className="container pt-5 mt-5 mb-5">
                <h1 className="mb-4">Новый рецепт</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit} className="row g-3">

                    {/* Заголовок */}
                    <div className="col-12">
                        <input
                            type="text"
                            className="form-control bg-dark text-light"
                            placeholder="Название"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Описание */}
                    <div className="col-12">
            <textarea
                className="form-control bg-dark text-light"
                placeholder="Описание"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
                rows={3}
            />
                    </div>

                    {/* Ингредиенты */}
                    <div className="col-12">
                        <label className="form-label">Ингредиенты</label>
                        {form.ingredients.map((ing, i) => (
                            <div key={i} className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control bg-dark text-light"
                                    placeholder={`Ингредиент #${i + 1}`}
                                    value={ing}
                                    onChange={e => handleChange('ingredients', i, e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => removeField('ingredients', i)}
                                    disabled={form.ingredients.length === 1}
                                    title="Удалить поле"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() => addField('ingredients')}
                        >
                            + Добавить ингредиент
                        </button>
                    </div>

                    {/* Шаги приготовления */}
                    <div className="col-12">
                        <label className="form-label">Шаги приготовления</label>
                        {form.steps.map((step, i) => (
                            <div key={i} className="input-group mb-2">
                <textarea
                    className="form-control bg-dark text-light"
                    placeholder={`Шаг #${i + 1}`}
                    value={step}
                    onChange={e => handleChange('steps', i, e.target.value)}
                    required
                    rows={2}
                />
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => removeField('steps', i)}
                                    disabled={form.steps.length === 1}
                                    title="Удалить поле"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() => addField('steps')}
                        >
                            + Добавить шаг
                        </button>
                    </div>

                    {/* Кнопка «Создать» */}
                    <div className="col-12">
                        <button className="btn btn-success w-100">Создать рецепт</button>
                    </div>
                </form>
            </div>
        );
    }

    // Загрузка медиа после создания
    return (
        <div className="container pt-5 mt-5 mb-5">
            <h2 className="mb-4">Рецепт #{createdId} создан!</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <label className="form-label">Изображение</label>
                <input
                    type="file"
                    accept="image/*"
                    className="form-control bg-dark text-light"
                    onChange={e => setImageFile(e.target.files[0])}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Видео</label>
                <input
                    type="file"
                    accept="video/*"
                    className="form-control bg-dark text-light"
                    onChange={e => setVideoFile(e.target.files[0])}
                />
            </div>

            <button className="btn btn-primary" onClick={handleUpload}>
                Загрузить медиа и перейти
            </button>
        </div>
    );
}
