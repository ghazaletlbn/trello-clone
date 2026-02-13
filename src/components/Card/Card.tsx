'use client';

import styles from './Card.module.scss';

interface CardProps {
    title: string;
    commentsCount: number;
    onOpenComments: () => void;
}

export default function Card({ title, commentsCount, onOpenComments }: CardProps) {
    return (
        <div className={styles.card}>
            <h3>{title}</h3>
            <div className={styles.cardFooter}>
                <button onClick={onOpenComments}>
                    💬 Comments ({commentsCount})
                </button>
            </div>
        </div>
    );
}
