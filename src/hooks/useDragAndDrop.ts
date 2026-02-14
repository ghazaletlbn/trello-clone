import {DragEndEvent, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {arrayMove} from '@dnd-kit/sortable';
import {BoardData} from '@/types/board';

export const useDragAndDrop = (setLists: React.Dispatch<React.SetStateAction<BoardData>>) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (!over || active.id === over.id) return;

        setLists(prevLists =>
            prevLists.map(list => {
                const oldIndex = list.cards.findIndex(c => c.id === active.id);
                const newIndex = list.cards.findIndex(c => c.id === over.id);

                if (oldIndex === -1 || newIndex === -1) {
                    return list;
                }

                return {
                    ...list,
                    cards: arrayMove(list.cards, oldIndex, newIndex),
                };
            })
        );
    };

    return {sensors, handleDragEnd};
};
