import {DragEndEvent, DragOverEvent, PointerSensor, TouchSensor, useSensor, useSensors} from '@dnd-kit/core';
import {arrayMove} from '@dnd-kit/sortable';
import {BoardData} from '@/types/board';

export const useDragAndDrop = (
    lists: BoardData,
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

    const findContainer = (id: string) => {
        if (lists.find(list => list.id === id)) {
            return id;
        }
        return lists.find(list => list.cards.some(card => card.id === id))?.id;
    };

    const handleDragOver = (event: DragOverEvent) => {
        const {active, over} = event;
        if (!over) return;

        const activeId = active.id.toString();
        const overId = over.id.toString();

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        setLists((prev) => {
            const activeItems = prev.find(l => l.id === activeContainer)?.cards || [];
            const overItems = prev.find(l => l.id === overContainer)?.cards || [];
            const activeIndex = activeItems.findIndex(c => c.id === activeId);
            const overIndex = overItems.findIndex(c => c.id === overId);

            let newIndex;

            if (lists.find(l => l.id === overId)) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top >
                    over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return prev.map(list => {
                if (list.id === activeContainer) {
                    return {
                        ...list,
                        cards: list.cards.filter(c => c.id !== activeId)
                    };
                }
                if (list.id === overContainer) {
                    const newCards = [
                        ...list.cards.slice(0, newIndex),
                        activeItems[activeIndex],
                        ...list.cards.slice(newIndex, list.cards.length)
                    ];
                    return {
                        ...list,
                        cards: newCards
                    };
                }
                return list;
            });
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (!over) return;

        const activeId = active.id.toString();
        const overId = over.id.toString();

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (
            activeContainer &&
            overContainer &&
            activeContainer === overContainer
        ) {
            const listIndex = lists.findIndex(l => l.id === activeContainer);
            const list = lists[listIndex];

            const activeIndex = list.cards.findIndex(c => c.id === activeId);
            const overIndex = list.cards.findIndex(c => c.id === overId);

            if (activeIndex !== overIndex) {
                setLists((prev) => {
                    const newLists = [...prev];
                    newLists[listIndex] = {
                        ...list,
                        cards: arrayMove(list.cards, activeIndex, overIndex)
                    };
                    return newLists;
                });
            }
        }
    };

    return {sensors, handleDragOver, handleDragEnd};
};
