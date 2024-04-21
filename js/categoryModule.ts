import { Task } from './taskModule';

export interface Category {
    id: number;
    name: string;
    tasks: Task[];
}
