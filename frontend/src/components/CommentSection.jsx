
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function CommentSection({ comments, onComment }) {
    const { user } = useContext(AuthContext);
    const [text, setText] = useState('');

    const submit = e => {
        e.preventDefault();
        if (!text.trim()) return;
        onComment(text);
        setText('');
    };

    return (
        <div className="mt-4">
            {user && (
                <form onSubmit={submit} className="mb-4">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Оставить комментарий"
                            value={text}
                            onChange={e => setText(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit">
                            Отправить
                        </button>
                    </div>
                </form>
            )}

            <h5 className="mb-3">Комментарии</h5>
            <ul className="list-group">
                {comments.map(c => (
                    <li key={c.id} className="list-group-item">
                        <strong>@{c.user_id}:</strong> {c.content}
                    </li>
                ))}
                {comments.length === 0 && (
                    <li className="list-group-item text-muted">Пока нет комментариев</li>
                )}
            </ul>
        </div>
    );
}
