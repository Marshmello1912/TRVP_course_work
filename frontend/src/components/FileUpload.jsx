import React, { useState } from 'react';

export default function FileUpload({ onUpload }) {
    const [mediaType, setMediaType] = useState('image');

    const handleFileChange = async e => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            await onUpload(file, mediaType);
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
            <select
                value={mediaType}
                onChange={e => setMediaType(e.target.value)}
            >
                <option value="image">Image</option>
                <option value="video">Video</option>
            </select>

            <input
                type="file"
                accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileChange}
            />
        </div>
    );
}
