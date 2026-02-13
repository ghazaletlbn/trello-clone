'use client';

import {useState} from 'react';
import List from '../List/List';
import styles from './Board.module.scss';
import {initialBoardData} from '@/data/initialBoard';
import {BoardData} from '@/types/board';

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

    const handleCancelList = () => {
        setNewListTitle('');
        setIsAddingList(false);
    };

    const handleAddCard = (listId: string, cardTitle: string) => {
        setLists(prevLists =>
            prevLists.map(list =>
                list.id === listId
                    ? {
                        ...list,
                        cards: [
                            ...list.cards,
                            {
                                id: Date.now().toString(),
                                title: cardTitle,
                                comments: []
                            }
                        ]
                    }
                    : list
            )
        );
    };

    const handleDeleteList = (listId: string) => {
        setLists(prevLists => prevLists.filter(list => list.id !== listId));
    };

    const handleDeleteAllCards = (listId: string) => {
        setLists(prevLists =>
            prevLists.map(list =>
                list.id === listId ? {...list, cards: []} : list
            )
        );
    };

    const handleAddComment = (listId: string, cardId: string, commentText: string) => {
        setLists(prevLists =>
            prevLists.map(list =>
                list.id === listId
                    ? {
                        ...list,
                        cards: list.cards.map(card =>
                            card.id === cardId
                                ? {
                                    ...card,
                                    comments: [
                                        ...(card.comments || []),
                                        {
                                            id: Date.now().toString(),
                                            text: commentText,
                                            timestamp: new Date().toLocaleString('en-US', {
                                                month: '2-digit',
                                                day: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })
                                        }
                                    ]
                                }
                                : card
                        )
                    }
                    : list
            )
        );
    };

    return (
        <div className={styles.board}>
            <div className={styles.boardHeader}>
                <h1>Demo Board</h1>
            </div>
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
        </div>
    );
}
