export interface IVehicle {
    id?: number;
    vehicleNumber?: string;
    brand?: string;
    model?: string;
}

export class Vehicle implements IVehicle {
    constructor(public id?: number, public vehicleNumber?: string, public brand?: string, public model?: string) {}
}
