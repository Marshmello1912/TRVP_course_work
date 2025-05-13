import React from 'react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function MediaGallery({ media }) {
    const images = media.filter(m => m.media_type === 'image');
    const videos = media.filter(m => m.media_type === 'video');

    return (
        <div>
            {images.map((m, i) => (
                <div key={i} className="d-flex justify-content-center mb-3">
                    <img
                        src={`${API_URL}${m.url}`}
                        alt=""
                        style={{
                            width: '500px',
                            height: '500px',
                            objectFit: 'cover',
                        }}
                    />
                </div>
            ))}
            {videos.map((m, i) => (
                <div key={i} className="d-flex justify-content-center mb-3">
                    <video
                        src={`${API_URL}${m.url}`}
                        width="500"
                        controls
                    />
                </div>
            ))}
        </div>
    );
}
