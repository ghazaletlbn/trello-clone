'use client';

import List from '../List/List';
import styles from './Board.module.scss';
import { initialBoardData } from '@/data/initialBoard';
import {BoardData} from "@/types/board";
import {useState} from "react";

export default function Board() {
    const [lists, setLists] = useState<BoardData>(initialBoardData);
    return (
        <div className={styles.board}>
            <div className={styles.boardHeader}>
                <h1>Demo Board</h1>
            </div>
            <div className={styles.boardLists}>
                {initialBoardData.map(list => (
                    <List key={list.id} title={list.title} cards={list.cards} />
                ))}
                <button className={styles.addList}>+ Add another list</button>
            </div>
        </div>
    );
}
