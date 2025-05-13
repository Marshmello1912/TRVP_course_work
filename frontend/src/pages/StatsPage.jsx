import React, { useState, useEffect } from 'react';
import { useParams, Link }           from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line }                      from 'react-chartjs-2';
import { getRecipeStats }            from '../api';

// регистрируем нужные компоненты Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function StatsPage() {
    const { id }                = useParams();
    const [stats, setStats]     = useState({ likes: [], comments: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');

    useEffect(() => {
        (async () => {
            try {
                const res = await getRecipeStats(id);
                setStats(res.data);
            } catch (e) {
                if (e.response?.status === 403) {
                    setError(e.response.data.detail || 'Доступ запрещён');
                } else {
                    setError('Не удалось загрузить статистику');
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return <p className="pt-5 text-center">Загрузка статистики…</p>;
    }
    if (error) {
        return (
            <div className="container pt-5">
                <div className="alert alert-danger text-center">{error}</div>
                <Link to={`/recipes/${id}`} className="d-block text-center mt-3">
                    ← Вернуться к рецепту
                </Link>
            </div>
        );
    }

    // готовим данные для графика рейтинга (накопительная сумма)
    const likesLabels  = stats.likes.map(pt => pt.date);
    let cum = 0;
    const cumulativeLikes = stats.likes.map(pt => (cum += pt.value));

    // готовим данные для графика комментариев
    const commentsLabels  = stats.comments.map(pt => pt.date);
    const commentsData    = stats.comments.map(pt => pt.value);

    // единый объект с опциями для контрастных шрифтов
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: { color: '#ffffff' },
                grid: { color: 'rgba(255,255,255,0.2)' },
            },
            y: {
                ticks: { color: '#ffffff' },
                grid: { color: 'rgba(255,255,255,0.2)' },
            }
        },
        plugins: {
            legend: {
                labels: { color: '#ffffff' }
            },
            tooltip: {
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                backgroundColor: 'rgba(0,0,0,0.7)'
            }
        }
    };

    return (
        <div className="container pt-5 mt-5 mb-5 text-white">
            <Link to={`/recipes/${id}`} className="d-block mb-3 text-info">
                ← Вернуться к рецепту
            </Link>
            <h1 className="mb-4 text-light">Статистика рецепта #{id}</h1>

            <div className="mb-5">
                <h5 className="text-light">Динамика общего рейтинга</h5>
                <div style={{ height: '300px' }}>
                    <Line
                        data={{
                            labels: likesLabels,
                            datasets: [{
                                label: 'Общий рейтинг',
                                data: cumulativeLikes,
                                borderColor: 'rgb(75, 192, 192)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                tension: 0.1,
                            }]
                        }}
                        options={commonOptions}
                    />
                </div>
            </div>

            <div>
                <h5 className="text-light">Новых комментариев</h5>
                <div style={{ height: '300px' }}>
                    <Line
                        data={{
                            labels: commentsLabels,
                            datasets: [{
                                label: 'Новых комментариев',
                                data: commentsData,
                                borderColor: 'rgb(53, 162, 235)',
                                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                                tension: 0.1,
                            }]
                        }}
                        options={commonOptions}
                    />
                </div>
            </div>
        </div>
    );
}
