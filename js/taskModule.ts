import { Category } from './categoryModule';

export interface Task {
    id: number;
    titre: string;
    description: string;
    date: Date;
    etat: string;
}
