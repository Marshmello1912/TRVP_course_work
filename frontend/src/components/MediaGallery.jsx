// src/components/MediaGallery.jsx
import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function MediaGallery({ media }) {
    const images = media.filter(m => m.media_type === 'image');
    const videos = media.filter(m => m.media_type === 'video');

    const placeholder = `${API_URL}/uploads/Errors/NoImage.jpg`;

    return (
        <div>
            {/* Изображения или заглушка */}
            {images.length > 0 ? (
                images.map((m, i) => (
                    <div key={i} className="d-flex justify-content-center mb-3">
                        <img
                            src={`${API_URL}${m.url}?timestamp=${Date.now()}`}
                            alt=""
                            style={{
                                width: '500px',
                                height: '500px',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                ))
            ) : (
                <div className="d-flex justify-content-center mb-3">
                    <img
                        src={placeholder}
                        alt="Нет изображения"
                        style={{
                            width: '500px',
                            height: '500px',
                            objectFit: 'cover',
                        }}
                    />
                </div>
            )}

            {/* Видео */}
            {videos.map((m, i) => (
                <div key={i} className="d-flex justify-content-center mb-3">
                    <video
                        src={`${API_URL}${m.url}?timestamp=${Date.now()}`}
                        width="500"
                        controls
                    />
                </div>
            ))}
        </div>
    );
}
