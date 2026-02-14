import {DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors} from '@dnd-kit/core';
import {arrayMove} from '@dnd-kit/sortable';
import {BoardData} from '@/types/board';

export const useDragAndDrop = (
    setLists: React.Dispatch<React.SetStateAction<BoardData>>
) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {distance: 5},
        }),
        useSensor(TouchSensor, {
            activationConstraint: {delay: 250, tolerance: 5},
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over) return;

        setLists(prevLists => {
            const sourceListIndex = prevLists.findIndex(list =>
                list.cards.some(card => card.id === active.id)
            );

            if (sourceListIndex === -1) return prevLists;

            const sourceList = prevLists[sourceListIndex];
            const sourceCardIndex = sourceList.cards.findIndex(
                card => card.id === active.id
            );
            const draggedCard = sourceList.cards[sourceCardIndex];

            let targetListIndex = prevLists.findIndex(list =>
                list.cards.some(card => card.id === over.id)
            );

            if (targetListIndex === -1) {
                targetListIndex = prevLists.findIndex(
                    list => list.id === over.id
                );
            }

            if (targetListIndex === -1) return prevLists;

            if (sourceListIndex === targetListIndex) {
                const targetCardIndex = sourceList.cards.findIndex(
                    card => card.id === over.id
                );

                if (targetCardIndex === -1) return prevLists;

                const newLists = [...prevLists];
                newLists[sourceListIndex] = {
                    ...sourceList,
                    cards: arrayMove(
                        sourceList.cards,
                        sourceCardIndex,
                        targetCardIndex
                    ),
                };
                return newLists;
            }

            const newLists = [...prevLists];

            newLists[sourceListIndex] = {
                ...sourceList,
                cards: sourceList.cards.filter(c => c.id !== active.id),
            };

            const targetList = newLists[targetListIndex];
            const targetCardIndex = targetList.cards.findIndex(
                card => card.id === over.id
            );

            const insertIndex =
                targetCardIndex === -1
                    ? targetList.cards.length
                    : targetCardIndex;

            newLists[targetListIndex] = {
                ...targetList,
                cards: [
                    ...targetList.cards.slice(0, insertIndex),
                    draggedCard,
                    ...targetList.cards.slice(insertIndex),
                ],
            };

            return newLists;
        });
    };

    return {sensors, handleDragEnd};
};
