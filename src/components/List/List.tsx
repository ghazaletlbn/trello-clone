import Card from '../Card/Card';
import styles from './List.module.scss';

interface ListProps {
    title: string;
    cards: { id: string; title: string }[];
}

export default function List({ title, cards }: ListProps) {
    return (
        <div className={styles.list}>
            <div className={styles.listHeader}>
                <h2>{title}</h2>
                <button>⋮</button>
            </div>
            <div className={styles.listCards}>
                {cards.map(card => (
                    <Card key={card.id} title={card.title} />
                ))}
            </div>
            <button className={styles.addCard}>+ Add another card</button>
        </div>
    );
}
