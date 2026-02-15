'use client';

import {useMemo, useState} from 'react';
import CommentModal from '../CommentModal/CommentModal';
import styles from './List.module.scss';
import {List as ListType} from '@/types/board';
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import SortableCard from "@/components/SortableCard/SortableCard";
import ListMenu from './ListMenu';
import ListFooter from './ListFooter';

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
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

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
                        <ListMenu
                            onDeleteList={() => onDeleteList(listId)}
                            onDeleteAllCards={() => onDeleteAllCards(listId)}
                        />
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

                {!isOverlay && (
                    <ListFooter onAddCard={(title) => onAddCard(listId, title)}/>
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
