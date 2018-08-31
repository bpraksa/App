export interface IType {
    id?: number;
    name?: string;
    description?: string;
}

export class Type implements IType {
    constructor(public id?: number, public name?: string, public description?: string) {}
}
