'use client';

import List from '../List/List';
import styles from './Board.module.scss';
import {closestCorners, DndContext} from '@dnd-kit/core';
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

    return (
        <div className={styles.board}>
            <div className={styles.boardHeader}>
                <h1>Demo Board</h1>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
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
            </DndContext>
        </div>
    );
}
