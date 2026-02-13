'use client';

import { useState } from 'react';
import Card from '../Card/Card';
import styles from './List.module.scss';
import { List as ListType } from '@/types/board';

interface ListProps {
    listId: string;
    title: string;
    cards: ListType['cards'];
    onAddCard: (listId: string, cardTitle: string) => void;
}

export default function List({ listId, title, cards, onAddCard }: ListProps) {
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');

    const handleAddCard = () => {
        if (!newCardTitle.trim()) return;

        onAddCard(listId, newCardTitle.trim());
        setNewCardTitle('');
        setIsAddingCard(false);
    };

    const handleCancel = () => {
        setNewCardTitle('');
        setIsAddingCard(false);
    };

    return (
        <div className={styles.list}>
            <div className={styles.listHeader}>
                <h2>{title}</h2>
                <button>⋮</button>
            </div>
            <div className={styles.listCards}>
                {cards.map(card => (
                    <Card key={card.id} title={card.title} />
                ))}
            </div>

            {isAddingCard ? (
                <div className={styles.addCardForm}>
                    <input
                        type="text"
                        placeholder="Enter a card title..."
                        value={newCardTitle}
                        onChange={e => setNewCardTitle(e.target.value)}
                        autoFocus
                        className={styles.addCardInput}
                    />
                    <div className={styles.addCardActions}>
                        <button
                            className={styles.addCardSubmit}
                            onClick={handleAddCard}
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
            ) : (
                <button
                    className={styles.addCard}
                    onClick={() => setIsAddingCard(true)}
                >
                    + Add another card
                </button>
            )}
        </div>
    );
}
