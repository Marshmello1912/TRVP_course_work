import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {fetchRecipe, updateRecipe, uploadMedia} from '../api';

export default function EditRecipePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        ingredients: [''],
        steps: [''],
    });

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await fetchRecipe(id);
                setForm({
                    title: data.title,
                    description: data.description,
                    ingredients: data.ingredients || [''],
                    steps: data.steps || [''],
                });
            } catch (err) {
                console.error(err);
                alert('Ошибка загрузки рецепта');
            }
        };
        load();
    }, [id]);
    const handleChange = (field, index, value) => {
        const updated = [...form[field]];
        updated[index] = value;
        setForm({ ...form, [field]: updated });
    };

    const addField = (field) => {
        setForm({ ...form, [field]: [...form[field], ''] });
    };

    const removeField = (field, index) => {
        const updated = form[field].filter((_, i) => i !== index);
        setForm({ ...form, [field]: updated.length ? updated : [''] });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateRecipe(id, form);

            if (imageFile) {
                await uploadMedia(id, imageFile, 'image');
            }
            if (videoFile) {
                await uploadMedia(id, videoFile, 'video');
            }

            navigate(`/recipes/${id}`);
        } catch (err) {
            console.error(err);
            alert('Ошибка обновления рецепта');
        }
    };


    return (
        <div className="container mt-5 pt-5">
            <h2 className="mb-4">Редактировать рецепт</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Название</label>
                    <input className="form-control bg-dark text-light" value={form.title} onChange={e => setTitle(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label>Описание</label>
                    <textarea className="form-control bg-dark text-light" value={form.description}
                              onChange={e => setDescription(e.target.value)}/>
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

                {/* Шаги */}
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


                <div className="mb-3">
                    <label className="form-label">Добавить изображение</label>
                    <input type="file"  accept="image/*" className="form-control" onChange={e => setImageFile(e.target.files[0])}/>
                </div>

                <div className="mb-3">
                    <label className="form-label">Добавить видео</label>
                    <input type="file" accept="video/*" className="form-control" onChange={e => setVideoFile(e.target.files[0])}/>
                </div>

                <button className="btn btn-success w-100">Сохранить</button>
            </form>
        </div>
    );
}
