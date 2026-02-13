'use client';

import { useState } from 'react';
import List from '../List/List';
import styles from './Board.module.scss';
import { initialBoardData } from '@/data/initialBoard';
import { BoardData } from '@/types/board';

export default function Board() {
    const [lists, setLists] = useState<BoardData>(initialBoardData);
    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');

    const handleAddList = () => {
        if (!newListTitle.trim()) return;

        setLists(prevLists => [
            ...prevLists,
            {
                id: Date.now().toString(),
                title: newListTitle.trim(),
                cards: []
            }
        ]);

        setNewListTitle('');
        setIsAddingList(false);
    };

    const handleCancel = () => {
        setNewListTitle('');
        setIsAddingList(false);
    };

    return (
        <div className={styles.board}>
            <div className={styles.boardHeader}>
                <h1>Demo Board</h1>
            </div>
            <div className={styles.boardLists}>
                {lists.map(list => (
                    <List key={list.id} title={list.title} cards={list.cards} />
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
                                onClick={handleCancel}
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
        </div>
    );
}
