'use client';

import {useCallback, useEffect, useState} from 'react';
import List from '../List/List';
import Card from '../Card/Card';
import styles from './Board.module.scss';
import {
    closestCorners,
    CollisionDetection,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    getFirstCollision,
    PointerSensor,
    pointerWithin,
    rectIntersection,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {distance: 5},
        }),
        useSensor(TouchSensor, {
            activationConstraint: {delay: 250, tolerance: 5},
        })
    );

    const {handleDragOver, handleDragEnd} = useDragAndDrop(lists, setLists);

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

    const customCollisionDetection: CollisionDetection = useCallback((args) => {
        const {active, droppableContainers} = args;

        if (active.data.current?.type === 'Column') {
            const columnContainers = droppableContainers.filter(
                (container) => container.data.current?.type === 'Column'
            );
            return closestCorners({
                ...args,
                droppableContainers: columnContainers,
            });
        }

        const pointerCollisions = pointerWithin(args);
        const intersections = pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);

        const overId = getFirstCollision(intersections, 'id');

        if (overId != null) {
            const overContainer = droppableContainers.find((container) => container.id === overId);
            if (overContainer) {
                if (overContainer.data.current?.type === 'Column') {
                    return [{id: overId}];
                }
            }
        }

        return closestCorners(args);
    }, []);

    if (!mounted) {
        return (
            <div className={styles.board}>
                <div className={styles.boardHeader}>
                    <h1>Demo Board</h1>
                </div>
                <div className={styles.boardLists}>
                    {lists.map(list => (
                        <div key={list.id} style={{
                            backgroundColor: '#f1f2f4',
                            borderRadius: '12px',
                            padding: '12px',
                            minWidth: '280px',
                            width: '280px',
                            margin: '0 8px 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '100%'
                        }}>
                            <div style={{padding: '8px', fontWeight: '600', fontSize: '14px', color: '#172b4d'}}>
                                {list.title}
                            </div>
                        </div>
                    ))}
                    <button className={styles.addList}>
                        + Add another list
                    </button>
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
                collisionDetection={customCollisionDetection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEndWrapper}
            >
                <div className={styles.boardLists}>
                    <SortableContext
                        items={lists.map(l => l.id)}
                        strategy={horizontalListSortingStrategy}
                    >
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

                <DragOverlay dropAnimation={{
                    duration: 250,
                    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                }}>
                    {activeCard ? (
                        <div style={{transform: 'rotate(4deg)', cursor: 'grabbing'}}>
                            <Card
                                title={activeCard.title}
                                commentsCount={activeCard.commentsCount}
                                onOpenComments={() => {
                                }}
                            />
                        </div>
                    ) : null}

                    {activeList ? (
                        <div style={{
                            opacity: 0.8,
                            transform: 'rotate(2deg)',
                            height: '100%'
                        }}>
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
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
