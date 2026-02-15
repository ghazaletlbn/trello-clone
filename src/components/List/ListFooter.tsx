'use client';

import {useState} from 'react';
import styles from './List.module.scss';
import InlineForm from "@/components/InlineForm/InlineForm";

interface ListFooterProps {
    onAddCard: (title: string) => void;
}

export default function ListFooter({onAddCard}: ListFooterProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = (title: string) => {
        onAddCard(title);
        setIsAdding(false);
    };

    if (isAdding) {
        return (
            <InlineForm
                placeholder="Enter a card title..."
                buttonText="Create card"
                onSubmit={handleSubmit}
                onCancel={() => setIsAdding(false)}
            />
        );
    }

    return (
        <button
            className={styles.addCard}
            onClick={() => setIsAdding(true)}
        >
            + Add another card
        </button>
    );
}
