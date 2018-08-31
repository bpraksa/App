export interface ICity {
    id?: number;
    name?: string;
    zipcode?: string;
}

export class City implements ICity {
    constructor(public id?: number, public name?: string, public zipcode?: string) {}
}
