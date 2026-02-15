import {useEffect, useRef, useState} from 'react';
import {BoardData} from '@/types/board';
import {initialBoardData} from '@/data/initialBoard';

const STORAGE_KEY = 'kanban-board-state';

export const useBoardState = () => {
    const [lists, setLists] = useState<BoardData>(initialBoardData);
    const [isAddingList, setIsAddingList] = useState(false);
    const isLoaded = useRef(false);
    useEffect(() => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setLists(parsedData);
            }
        } catch (error) {
            console.error('Failed to load board state from localStorage:', error);
        } finally {
            isLoaded.current = true;
        }
    }, []);

    useEffect(() => {
        if (isLoaded.current) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
            } catch (error) {
                console.error('Failed to save board state to localStorage:', error);
            }
        }
    }, [lists]);

    const handleAddList = (title: string) => {
        setLists(prevLists => [
            ...prevLists,
            {
                id: Date.now().toString(),
                title: title,
                cards: []
            }
        ]);
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

    return {
        lists,
        setLists,
        isAddingList,
        setIsAddingList,
        handleAddList,
        handleAddCard,
        handleDeleteList,
        handleDeleteAllCards,
        handleAddComment
    };
};
