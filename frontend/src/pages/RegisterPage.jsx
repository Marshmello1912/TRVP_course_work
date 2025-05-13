import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function RegisterPage() {
    const { register, loading } = useContext(AuthContext);
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        if (form.password !== form.password2) {
            setError('Пароли не совпадают');
            return;
        }
        try {
            await register({
                username: form.username,
                email: form.email,
                password: form.password
            });
            navigate('/');
        } catch (e) {
            setError(e.response?.data?.detail || 'Ошибка регистрации');
        }
    };

    if (loading) return <p className="pt-5 text-center">Загрузка…</p>;

    return (
        <div className="container pt-5 mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4 text-center">Регистрация</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit} className="mb-3">
                <div className="mb-3">
                    <input
                        className="form-control"
                        placeholder="Логин"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Пароль"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Повторите пароль"
                        value={form.password2}
                        onChange={e => setForm({ ...form, password2: e.target.value })}
                        required
                    />
                </div>
                <button className="btn btn-success w-100" type="submit">
                    Зарегистрироваться
                </button>
            </form>
            <p className="text-center">
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
        </div>
    );
}
