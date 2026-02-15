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
import ListSkeleton from "@/components/ListSkeleton/ListSkeleton";
import InlineForm from "@/components/InlineForm/InlineForm";

export default function Board() {
    const {
        lists,
        setLists,
        isAddingList,
        setIsAddingList,
        handleAddList,
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
                        <ListSkeleton key={list.id} title={list.title}/>
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

                    <div className={styles.addListContainer}>
                        {isAddingList ? (
                            <div style={{width: '272px'}}>
                                <InlineForm
                                    placeholder="Enter a list title..."
                                    buttonText="Add list"
                                    onSubmit={handleAddList}
                                    onCancel={() => setIsAddingList(false)}
                                />
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
