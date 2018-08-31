import { IPosition } from 'app/shared/model//position.model';

export interface IEmployee {
    id?: number;
    firstName?: string;
    lastName?: string;
    position?: IPosition;
}

export class Employee implements IEmployee {
    constructor(public id?: number, public firstName?: string, public lastName?: string, public position?: IPosition) {}
}
