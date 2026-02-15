'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import CommentModal from '../CommentModal/CommentModal';
import styles from './List.module.scss';
import {List as ListType} from '@/types/board';
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import SortableCard from "@/components/SortableCard/SortableCard";

interface ListProps {
    listId: string;
    title: string;
    cards: ListType['cards'];
    onAddCard: (listId: string, cardTitle: string) => void;
    onDeleteList: (listId: string) => void;
    onDeleteAllCards: (listId: string) => void;
    onAddComment: (listId: string, cardId: string, commentText: string) => void;
    isOverlay?: boolean;
}

export default function List({
                                 listId,
                                 title,
                                 cards,
                                 onAddCard,
                                 onDeleteList,
                                 onDeleteAllCards,
                                 onAddComment,
                                 isOverlay = false
                             }: ListProps) {
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const sortableId = useMemo(() => isOverlay ? `${listId}-overlay` : listId, [listId, isOverlay]);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: sortableId,
        data: {
            type: 'Column',
            list: {id: listId, title, cards}
        },
        disabled: isOverlay
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    const overlayStyle = {
        transform: CSS.Translate.toString(transform),
        cursor: 'grabbing',
        opacity: 1,
        boxShadow: '0 5px 15px rgba(0,0,0,0.25)',
    };

    useEffect(() => {
        if (isOverlay) return;

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
    }, [isMenuOpen, isOverlay]);

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
            <div
                ref={setNodeRef}
                style={isOverlay ? overlayStyle : style}
                className={styles.list}
                {...attributes}
            >
                <div
                    className={styles.listHeader}
                    {...listeners}
                    style={{cursor: isOverlay ? 'grabbing' : 'grab'}}
                >
                    <h2>{title}</h2>
                    {!isOverlay && (
                        <div
                            className={styles.listMenu}
                            ref={menuRef}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
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
                    )}
                </div>

                <div
                    className={styles.listCards}
                    style={{
                        minHeight: cards.length === 0 ? '50px' : undefined,
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

                {!isOverlay && (isAddingCard ? (
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
                ))}
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
