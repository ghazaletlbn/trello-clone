import {useState} from 'react';
import {BoardData} from '@/types/board';
import {initialBoardData} from '@/data/initialBoard';

export const useBoardState = () => {
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

    return {
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
    };
};
