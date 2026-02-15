'use client';

import {useState} from 'react';
import styles from './InlineForm.module.scss';

interface InlineFormProps {
    placeholder?: string;
    buttonText?: string;
    onSubmit: (value: string) => void;
    onCancel: () => void;
}

export default function InlineForm({
                                       placeholder = 'Enter title...',
                                       buttonText = 'Add',
                                       onSubmit,
                                       onCancel
                                   }: InlineFormProps) {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        if (!value.trim()) return;
        onSubmit(value.trim());
        setValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit();
        if (e.key === 'Escape') {
            setValue('');
            onCancel();
        }
    };

    return (
        <div className={styles.form}>
            <input
                autoFocus
                type="text"
                className={styles.input}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <div className={styles.actions}>
                <button className={styles.submit} onClick={handleSubmit}>
                    {buttonText}
                </button>
                <button className={styles.cancel} onClick={onCancel}>
                    ✕
                </button>
            </div>
        </div>
    );
}
