import { IDeliveryOrder } from 'app/shared/model//delivery-order.model';
import { IOnlineOrderItem } from 'app/shared/model//online-order-item.model';

export interface IDeliveryOrderItem {
    id?: number;
    preparedAmount?: number;
    deliveredAmount?: number;
    deliveryOrder?: IDeliveryOrder;
    onlineOrderItem?: IOnlineOrderItem;
}

export class DeliveryOrderItem implements IDeliveryOrderItem {
    constructor(
        public id?: number,
        public preparedAmount?: number,
        public deliveredAmount?: number,
        public deliveryOrder?: IDeliveryOrder,
        public onlineOrderItem?: IOnlineOrderItem
    ) {}
}
