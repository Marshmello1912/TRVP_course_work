import {Routes, Route, Navigate} from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import HomePage     from './pages/HomePage.jsx';
import RecipePage   from './pages/RecipePage.jsx';
import UserPage     from './pages/UserPage.jsx';
import LoginPage    from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CreateRecipePage from "./pages/CreateRecipePage.jsx";
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import StatsPage from "./pages/StatsPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import EditRecipePage from "./pages/EditRecipePage.jsx";

function PrivateRoute({ children }) {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <p>Загрузка…</p>;
    return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <>
            <NavBar />
            <main className="pt-5 " style={{ paddingBottom: '60px'}} >
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recipes/:id" element={<RecipePage />} />
                <Route path="/users/:id" element={<UserPage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/create"
                    element={
                        <PrivateRoute>
                            <CreateRecipePage />
                        </PrivateRoute>
                    }
                />
                <Route path="/recipes/:id/stats" element={<StatsPage />} />
                <Route
                    path="/favorites"
                    element={
                        <PrivateRoute>
                            <FavoritesPage />
                        </PrivateRoute>
                    }
                />
                <Route path="/recipes/:id/edit" element={<PrivateRoute><EditRecipePage/></PrivateRoute>} />
            </Routes>

            </main>
            <Footer/>
        </>
    );
}
