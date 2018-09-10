import { IArticle } from 'app/shared/model//article.model';
import { IOnlineOrder } from 'app/shared/model//online-order.model';

export interface IOnlineOrderItem {
    id?: number;
    orderedAmount?: number;
    itemPrice?: number;
    onlineOrder?: IOnlineOrder;
    article?: IArticle;
    articleName?: string; // smart table column
    articlePrice?: number; // smart table column
}

export class OnlineOrderItem implements IOnlineOrderItem {

    constructor(
        public id?: number,
        public orderedAmount?: number,
        public itemPrice?: number,
        public onlineOrder?: IOnlineOrder,
        public article?: IArticle
    ) { }

}
