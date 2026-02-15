import {useEffect, useState} from 'react';
import {BoardData, Card, Comment, List} from '@/types/board';
import {initialBoardData} from '@/data/initialBoard';
import {useLocalStorage} from '@/hooks/useLocalStorage';
import {formatCurrentDate, generateId} from '@/utils/helpers';

const STORAGE_KEY = 'kanban-board-state';

export const useBoardState = () => {
    const {storedValue, setValue, isHydrated} = useLocalStorage<BoardData>(STORAGE_KEY, initialBoardData);

    const [lists, setLists] = useState<BoardData>(initialBoardData);
    const [isAddingList, setIsAddingList] = useState(false);


    useEffect(() => {
        if (isHydrated) {
            setLists(storedValue);
        }

    }, [isHydrated, storedValue]);

    const updateLists = (newState: BoardData | ((prev: BoardData) => BoardData)) => {
        if (typeof newState === 'function') {
            setLists(prev => {
                const updated = newState(prev);
                setValue(updated);
                return updated;
            });
        } else {
            setLists(newState);
            setValue(newState);
        }
    };

    const handleAddList = (title: string) => {
        const newList: List = {
            id: generateId(),
            title: title,
            cards: []
        };
        updateLists(prev => [...prev, newList]);
        setIsAddingList(false);
    };

    const handleAddCard = (listId: string, cardTitle: string) => {
        const newCard: Card = {
            id: generateId(),
            title: cardTitle,
            comments: []
        };

        updateLists(prev =>
            prev.map(list =>
                list.id === listId
                    ? {...list, cards: [...list.cards, newCard]}
                    : list
            )
        );
    };

    const handleDeleteList = (listId: string) => {
        updateLists(prev => prev.filter(list => list.id !== listId));
    };

    const handleDeleteAllCards = (listId: string) => {
        updateLists(prev =>
            prev.map(list =>
                list.id === listId ? {...list, cards: []} : list
            )
        );
    };

    const handleAddComment = (listId: string, cardId: string, commentText: string) => {
        const newComment: Comment = {
            id: generateId(),
            text: commentText,
            timestamp: formatCurrentDate()
        };

        updateLists(prev =>
            prev.map(list => {
                if (list.id !== listId) return list;

                return {
                    ...list,
                    cards: list.cards.map(card => {
                        if (card.id !== cardId) return card;
                        return {
                            ...card,
                            comments: [...(card.comments || []), newComment]
                        };
                    })
                };
            })
        );
    };

    return {
        lists,
        setLists: updateLists,
        isAddingList,
        setIsAddingList,
        handleAddList,
        handleAddCard,
        handleDeleteList,
        handleDeleteAllCards,
        handleAddComment
    };
};
