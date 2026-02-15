'use client';

import {useEffect, useRef, useState} from 'react';
import styles from './List.module.scss';

interface ListMenuProps {
    onDeleteList: () => void;
    onDeleteAllCards: () => void;
}

export default function ListMenu({onDeleteList, onDeleteAllCards}: ListMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleDeleteList = () => {
        onDeleteList();
        setIsOpen(false);
    };

    const handleDeleteAllCards = () => {
        onDeleteAllCards();
        setIsOpen(false);
    };

    return (
        <div
            className={styles.listMenu}
            ref={menuRef}
            onPointerDown={(e) => e.stopPropagation()}
        >
            <button
                className={styles.menuButton}
                onClick={() => setIsOpen(!isOpen)}
            >
                ⋮
            </button>
            {isOpen && (
                <div className={styles.dropdown}>
                    <h3 className={styles.dropdownTitle}>List Actions</h3>
                    <button onClick={handleDeleteList}>Delete List</button>
                    <button onClick={handleDeleteAllCards}>Delete All Cards</button>
                </div>
            )}
        </div>
    );
}
