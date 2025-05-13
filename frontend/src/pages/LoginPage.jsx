import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
    const { login, loading } = useContext(AuthContext);
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            await login(form);
            navigate(from, { replace: true });
        } catch {
            setError('Неверные учётные данные');
        }
    };

    if (loading) return <p className="pt-5 text-center">Загрузка…</p>;

    return (
        <div className="container pt-5 mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4 text-center">Войти</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit} className="mb-3">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Логин"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
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
                <button className="btn btn-primary w-100" type="submit">
                    Войти
                </button>
            </form>
            <p className="text-center">
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
}
