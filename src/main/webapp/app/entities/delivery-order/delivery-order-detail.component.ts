import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDeliveryOrder } from 'app/shared/model/delivery-order.model';

@Component({
    selector: 'jhi-delivery-order-detail',
    templateUrl: './delivery-order-detail.component.html'
})
export class DeliveryOrderDetailComponent implements OnInit {
    deliveryOrder: IDeliveryOrder;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ deliveryOrder }) => {
            this.deliveryOrder = deliveryOrder;
        });
    }

    previousState() {
        window.history.back();
    }
}
