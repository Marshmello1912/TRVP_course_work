import React from 'react';

export default function RatingControls({ rating, onRate }) {
    return (
        <div className="d-flex align-items-center gap-2 mb-3">
            <button
                type="button"
                onClick={() => onRate(1)}
                className="btn btn-outline-success btn-sm"
            >
                👍
            </button>
            <span className="fw-semibold">{rating.toFixed(1)}</span>
            <button
                type="button"
                onClick={() => onRate(-1)}
                className="btn btn-outline-danger btn-sm"
            >
                👎
            </button>
        </div>
    );
}
