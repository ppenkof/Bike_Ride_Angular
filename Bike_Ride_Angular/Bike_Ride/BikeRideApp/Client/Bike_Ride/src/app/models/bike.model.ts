export interface Bike {
    id: string; // maps from _id
    bikeName: string; // maps from name
    price: number;
    type: string;
    description: string;
    image: string;
    likes: number;
    booked?: boolean // Optional, if the bike can be booked
    _ownerId?: string;
    _createdOn?: Date;
    // available?: boolean
  }
  