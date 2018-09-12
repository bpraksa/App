import { Moment } from 'moment';
import { IEmployee } from 'app/shared/model//employee.model';
import { IVehicle } from 'app/shared/model//vehicle.model';
import { IOnlineOrder } from 'app/shared/model//online-order.model';

export interface IDeliveryOrder {
    id?: number;
    deliveryDate?: Moment;
    status?: string;
    driver?: IEmployee;
    warehouseClerk?: IEmployee;
    vehicle?: IVehicle;
    onlineOrder?: IOnlineOrder;
}

export class DeliveryOrder implements IDeliveryOrder {
    constructor(
        public id?: number,
        public deliveryDate?: Moment,
        public status?: string,
        public driver?: IEmployee,
        public warehouseClerk?: IEmployee,
        public vehicle?: IVehicle,
        public onlineOrder?: IOnlineOrder
    ) {}
}
