import { ICity } from 'app/shared/model//city.model';

export interface IClient {
    id?: number;
    name?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    city?: ICity;
}

export class Client implements IClient {
    constructor(
        public id?: number,
        public name?: string,
        public address?: string,
        public phoneNumber?: string,
        public email?: string,
        public city?: ICity
    ) {}
}
