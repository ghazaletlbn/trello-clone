import List from '../List/List';
import styles from './Board.module.scss';

export default function Board() {
    const lists = [
        {
            id: '1',
            title: 'Todo',
            cards: [
                { id: '1', title: 'Create interview Kanban' },
                { id: '2', title: 'Review Drag & Drop' }
            ]
        },
        {
            id: '2',
            title: 'In Progress',
            cards: [
                { id: '3', title: 'Set up Next.js project' }
            ]
        },
        {
            id: '3',
            title: 'Done',
            cards: []
        }
    ];

    return (
        <div className={styles.board}>
            <div className={styles.boardHeader}>
                <h1>Demo Board</h1>
            </div>
            <div className={styles.boardLists}>
                {lists.map(list => (
                    <List key={list.id} title={list.title} cards={list.cards} />
                ))}
                <button className={styles.addList}>+ Add another list</button>
            </div>
        </div>
    );
}
