import { ICity } from 'app/shared/model//city.model';
import { IClient } from 'app/shared/model//client.model';

export interface IOnlineOrder {
    id?: number;
    address?: string;
    phoneNumber?: string;
    totalPrice?: number;
    city?: ICity;
    client?: IClient;
}

export class OnlineOrder implements IOnlineOrder {
    constructor(
        public id?: number,
        public address?: string,
        public phoneNumber?: string,
        public totalPrice?: number,
        public city?: ICity,
        public client?: IClient
    ) {}
}
