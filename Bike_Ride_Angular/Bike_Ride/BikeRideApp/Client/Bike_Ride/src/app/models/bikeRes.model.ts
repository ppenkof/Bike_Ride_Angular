import { Bike } from './bike.model';

export interface BikeRes {
   products: {
     [uuid: string]: {
       _id: number;
       name: string;
       price: number;
       type: string;
       description: string;
       image: string;
       likes: number;
       booked:boolean;
      };
   };
 }
 