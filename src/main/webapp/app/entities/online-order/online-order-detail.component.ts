import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOnlineOrder } from 'app/shared/model/online-order.model';

@Component({
    selector: 'jhi-online-order-detail',
    templateUrl: './online-order-detail.component.html'
})
export class OnlineOrderDetailComponent implements OnInit {
    onlineOrder: IOnlineOrder;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ onlineOrder }) => {
            this.onlineOrder = onlineOrder;
        });
    }

    previousState() {
        window.history.back();
    }
}
