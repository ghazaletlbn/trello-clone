export interface Comment {
    id: string;
    text: string;
    timestamp: string;
}

export interface Card {
    id: string;
    title: string;
    comments?: Comment[];
}

export interface List {
    id: string;
    title: string;
    cards: Card[];
}

export type BoardData = List[];
