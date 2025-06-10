import React from 'react';

export default function RatingControls({ rating, onRate, userRating }) {
    return (
        <div className="d-flex align-items-center gap-2 mb-3">
            <button
                type="button"
                onClick={() => onRate(1)}
                className={`btn btn-sm ${userRating === 1 ? 'btn-success' : 'btn-outline-success'}`}
            >
                👍
            </button>
            <span className="fw-semibold">{rating.toFixed(1)}</span>
            <button
                type="button"
                onClick={() => onRate(-1)}
                className={`btn btn-sm ${userRating === -1 ? 'btn-danger' : 'btn-outline-danger'}`}
            >
                👎
            </button>
        </div>
    );
}
