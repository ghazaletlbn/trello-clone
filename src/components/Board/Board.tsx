'use client';

import {useState} from 'react';
import List from '../List/List';
import Card from '../Card/Card';
import styles from './Board.module.scss';
import {closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent} from '@dnd-kit/core';
import {useBoardState} from '@/hooks/useBoardState';
import {useDragAndDrop} from '@/hooks/useDragAndDrop';

export default function Board() {
    const {
        lists,
        setLists,
        isAddingList,
        setIsAddingList,
        newListTitle,
        setNewListTitle,
        handleAddList,
        handleCancelList,
        handleAddCard,
        handleDeleteList,
        handleDeleteAllCards,
        handleAddComment
    } = useBoardState();

    const {sensors, handleDragEnd} = useDragAndDrop(setLists);

    const [activeCard, setActiveCard] = useState<{
        id: string;
        title: string;
        commentsCount: number;
    } | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const {active} = event;
        for (const list of lists) {
            const card = list.cards.find(c => c.id === active.id);
            if (card) {
                setActiveCard({
                    id: card.id,
                    title: card.title,
                    commentsCount: card.comments?.length || 0,
                });
                break;
            }
        }
    };

    const handleDragEndWrapper = (event: DragEndEvent) => {
        handleDragEnd(event);
        setActiveCard(null);
    };

    return (
        <div className={styles.board}>
            <div className={styles.boardHeader}>
                <h1>Demo Board</h1>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEndWrapper}
            >
                <div className={styles.boardLists}>
                    {lists.map(list => (
                        <List
                            key={list.id}
                            listId={list.id}
                            title={list.title}
                            cards={list.cards}
                            onAddCard={handleAddCard}
                            onDeleteList={handleDeleteList}
                            onDeleteAllCards={handleDeleteAllCards}
                            onAddComment={handleAddComment}
                        />
                    ))}

                    {isAddingList ? (
                        <div className={styles.addListForm}>
                            <input
                                type="text"
                                placeholder="Enter a list title..."
                                value={newListTitle}
                                onChange={e => setNewListTitle(e.target.value)}
                                autoFocus
                                className={styles.addListInput}
                            />
                            <div className={styles.addListActions}>
                                <button
                                    className={styles.addListSubmit}
                                    onClick={handleAddList}
                                >
                                    Add list
                                </button>
                                <button
                                    className={styles.addListCancel}
                                    onClick={handleCancelList}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            className={styles.addList}
                            onClick={() => setIsAddingList(true)}
                        >
                            + Add another list
                        </button>
                    )}
                </div>

                <DragOverlay>
                    {activeCard ? (
                        <div style={{
                            transform: 'rotate(5deg)',
                            cursor: 'grabbing',
                        }}>
                            <Card
                                title={activeCard.title}
                                commentsCount={activeCard.commentsCount}
                                onOpenComments={() => {
                                }}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
