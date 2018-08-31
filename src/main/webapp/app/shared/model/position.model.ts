export interface IPosition {
    id?: number;
    name?: string;
}

export class Position implements IPosition {
    constructor(public id?: number, public name?: string) {}
}
