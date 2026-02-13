import styles from './Card.module.scss';

interface CardProps {
    title: string;
    commentsCount?: number;
}

export default function Card({ title, commentsCount = 0 }: CardProps) {
    return (
        <div className={styles.card}>
            <h3>{title}</h3>
            <div className={styles.cardFooter}>
                <button>
                    💬 Comments ({commentsCount})
                </button>
            </div>
        </div>
    );
}
