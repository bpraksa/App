import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';

@Component({
    selector: 'jhi-delivery-order-item-detail',
    templateUrl: './delivery-order-item-detail.component.html'
})
export class DeliveryOrderItemDetailComponent implements OnInit {
    deliveryOrderItem: IDeliveryOrderItem;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ deliveryOrderItem }) => {
            this.deliveryOrderItem = deliveryOrderItem;
        });
    }

    previousState() {
        window.history.back();
    }
}
