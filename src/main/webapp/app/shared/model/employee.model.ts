import { IPosition } from 'app/shared/model//position.model';

export interface IEmployee {
    id?: number;
    firstName?: string;
    lastName?: string;
    position?: IPosition;
    fullName?: string; // smart table column
    employeePosition?: string; // smart table column
}

export class Employee implements IEmployee {
    constructor(public id?: number, public firstName?: string, public lastName?: string, public position?: IPosition) {}
}
