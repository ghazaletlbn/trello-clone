'use client';

import {useEffect, useRef, useState} from 'react';
import CommentModal from '../CommentModal/CommentModal';
import styles from './List.module.scss';
import {List as ListType} from '@/types/board';
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useDroppable} from '@dnd-kit/core';
import SortableCard from "@/components/SortableCard/SortableCard";

interface ListProps {
    listId: string;
    title: string;
    cards: ListType['cards'];
    onAddCard: (listId: string, cardTitle: string) => void;
    onDeleteList: (listId: string) => void;
    onDeleteAllCards: (listId: string) => void;
    onAddComment: (listId: string, cardId: string, commentText: string) => void;
}

export default function List({
                                 listId,
                                 title,
                                 cards,
                                 onAddCard,
                                 onDeleteList,
                                 onDeleteAllCards,
                                 onAddComment
                             }: ListProps) {
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const {setNodeRef, isOver} = useDroppable({
        id: listId,
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

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

    const handleDeleteList = () => {
        onDeleteList(listId);
        setIsMenuOpen(false);
    };

    const handleDeleteAllCards = () => {
        onDeleteAllCards(listId);
        setIsMenuOpen(false);
    };

    const selectedCard = cards.find(card => card.id === selectedCardId);

    return (
        <>
            <div className={styles.list}>
                <div className={styles.listHeader}>
                    <h2>{title}</h2>
                    <div className={styles.listMenu} ref={menuRef}>
                        <button
                            className={styles.menuButton}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            ⋮
                        </button>
                        {isMenuOpen && (
                            <div className={styles.dropdown}>
                                <h3 className={styles.dropdownTitle}>List Actions</h3>
                                <button onClick={handleDeleteList}>Delete List</button>
                                <button onClick={handleDeleteAllCards}>Delete All Cards</button>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    ref={setNodeRef}
                    className={styles.listCards}
                    style={{
                        backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        transition: 'background-color 200ms ease',
                    }}
                >
                    <SortableContext
                        items={cards.map(card => card.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {cards.map(card => (
                            <SortableCard
                                key={card.id}
                                id={card.id}
                                title={card.title}
                                commentsCount={card.comments?.length || 0}
                                onOpenComments={() => setSelectedCardId(card.id)}
                            />
                        ))}
                    </SortableContext>
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

            {selectedCardId && selectedCard && (
                <CommentModal
                    cardTitle={selectedCard.title}
                    comments={selectedCard.comments || []}
                    onClose={() => setSelectedCardId(null)}
                    onAddComment={text => {
                        onAddComment(listId, selectedCardId, text);
                    }}
                />
            )}
        </>
    );
}
