export interface Card {
    id: string;
    title: string;
}

export interface List {
    id: string;
    title: string;
    cards: Card[];
}

export type BoardData = List[];
