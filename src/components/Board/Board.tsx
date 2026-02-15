'use client';

import {useEffect, useState} from 'react';
import List from '../List/List';
import Card from '../Card/Card';
import styles from './Board.module.scss';
import {DndContext, DragEndEvent, DragOverlay, DragStartEvent, pointerWithin} from '@dnd-kit/core';
import {useBoardState} from '@/hooks/useBoardState';
import {useDragAndDrop} from '@/hooks/useDragAndDrop';
import {horizontalListSortingStrategy, SortableContext} from '@dnd-kit/sortable';
import {List as ListType} from '@/types/board';

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

    const {sensors, handleDragOver, handleDragEnd} = useDragAndDrop(lists, setLists);

    const [mounted, setMounted] = useState(false);
    const [activeCard, setActiveCard] = useState<{
        id: string;
        title: string;
        commentsCount: number;
    } | null>(null);
    const [activeList, setActiveList] = useState<ListType | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDragStart = (event: DragStartEvent) => {
        const {active} = event;

        if (active.data.current?.type === 'Column') {
            setActiveList(active.data.current.list);
            return;
        }

        const card = lists.flatMap(l => l.cards).find(c => c.id === active.id);
        if (card) {
            setActiveCard({
                id: card.id,
                title: card.title,
                commentsCount: card.comments?.length || 0,
            });
        }
    };

    const handleDragEndWrapper = (event: DragEndEvent) => {
        handleDragEnd(event);
        setActiveCard(null);
        setActiveList(null);
    };

    if (!mounted) {
        return (
            <div className={styles.board}>
                <div className={styles.boardHeader}>
                    <h1>Demo Board</h1>
                </div>
                <div className={styles.boardLists}>
                    {lists.map(list => (
                        <div key={list.id} className={styles.listPreview} style={{minWidth: '280px', margin: '0 10px'}}>
                            <h2>{list.title}</h2>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.board}>
            <div className={styles.boardHeader}>
                <h1>Demo Board</h1>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEndWrapper}
            >
                <div className={styles.boardLists}>
                    <SortableContext items={lists.map(l => l.id)} strategy={horizontalListSortingStrategy}>
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
                    </SortableContext>

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
                        <div style={{transform: 'rotate(5deg)', cursor: 'grabbing'}}>
                            <Card
                                title={activeCard.title}
                                commentsCount={activeCard.commentsCount}
                                onOpenComments={() => {
                                }}
                            />
                        </div>
                    ) : null}

                    {activeList ? (
                        <List
                            listId={activeList.id}
                            title={activeList.title}
                            cards={activeList.cards}
                            onAddCard={() => {
                            }}
                            onDeleteList={() => {
                            }}
                            onDeleteAllCards={() => {
                            }}
                            onAddComment={() => {
                            }}
                            isOverlay={true}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
