import {BoardData} from '@/types/board';

export const initialBoardData: BoardData = [
    {
        id: '1',
        title: 'Todo',
        cards: [
            {id: '1', title: 'Create interview Kanban', comments: []},
            {id: '2', title: 'Review Drag & Drop', comments: []}
        ]
    },
    {
        id: '2',
        title: 'In Progress',
        cards: [{id: '3', title: 'Set up Next.js project', comments: []}]
    },
    {
        id: '3',
        title: 'Done',
        cards: []
    }
];
