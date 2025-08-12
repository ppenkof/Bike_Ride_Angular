import { User } from './user.model';  

export interface Bike {
    id: string;
    bikeName: string;
    price: number;
    type: string;
    description: string;
    imageUrl: string;
    likes: number;
}