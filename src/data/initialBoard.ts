import {BoardData} from '@/types/board';

export const initialBoardData: BoardData = [
    {
        id: 'list-1',
        title: 'Todo',
        cards: [
            {id: 'card-1', title: 'Create interview Kanban', comments: []},
            {id: 'card-2', title: 'Review Drag & Drop', comments: []}
        ]
    },
    {
        id: 'list-2',
        title: 'In Progress',
        cards: [{id: 'card-3', title: 'Set up Next.js project', comments: []}]
    },
    {
        id: 'list-3',
        title: 'Done',
        cards: []
    }
];
