import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export default function NavBar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-dark bg-dark fixed-top shadow-sm">
            <div className="container">
                <Link className="navbar-brand" to="/">Кулинарка</Link>
                <ul className="nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Главная</Link>
                    </li>

                    {user && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/create">Новый рецепт</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/favorites">Избранное</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/users/${user.id}`}>Профиль</Link>
                            </li>
                        </>
                    )}
                </ul>

                <ul className="nav ms-auto">
                    {user ? (
                        <li className="nav-item">
                            <button
                                className="btn btn-outline-danger"
                                onClick={handleLogout}
                            >
                                Выйти
                            </button>
                        </li>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Войти</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Регистрация</Link>
                            </li>
                        </>
                    )}
                </ul>
                <button className="btn btn-outline-secondary" onClick={toggleTheme}>
                    {theme === 'darkly' ? 'Светлая тема' : 'Тёмная тема'}
                </button>
            </div>
        </nav>
    );
}
