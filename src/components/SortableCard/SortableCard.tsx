'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from '../Card/Card';

interface SortableCardProps {
    id: string;
    title: string;
    commentsCount: number;
    onOpenComments: () => void;
}

export default function SortableCard({
id,
title,
commentsCount,
onOpenComments,}: SortableCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card
                title={title}
                commentsCount={commentsCount}
                onOpenComments={onOpenComments}
            />
        </div>
    );
}
