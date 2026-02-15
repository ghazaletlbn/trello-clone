'use client';

import {useState} from 'react';
import styles from './List.module.scss';

interface ListFooterProps {
    onAddCard: (title: string) => void;
}

export default function ListFooter({onAddCard}: ListFooterProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');

    const handleSubmit = () => {
        if (!title.trim()) return;
        onAddCard(title.trim());
        setTitle('');
        setIsAdding(false);
    };

    const handleCancel = () => {
        setTitle('');
        setIsAdding(false);
    };

    if (isAdding) {
        return (
            <div className={styles.addCardForm}>
                <input
                    type="text"
                    placeholder="Enter a card title..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                    className={styles.addCardInput}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmit();
                        if (e.key === 'Escape') handleCancel();
                    }}
                />
                <div className={styles.addCardActions}>
                    <button
                        className={styles.addCardSubmit}
                        onClick={handleSubmit}
                    >
                        Create card
                    </button>
                    <button
                        className={styles.addCardCancel}
                        onClick={handleCancel}
                    >
                        ✕
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            className={styles.addCard}
            onClick={() => setIsAdding(true)}
        >
            + Add another card
        </button>
    );
}
