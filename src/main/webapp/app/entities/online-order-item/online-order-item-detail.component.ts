import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOnlineOrderItem } from 'app/shared/model/online-order-item.model';

@Component({
    selector: 'jhi-online-order-item-detail',
    templateUrl: './online-order-item-detail.component.html'
})
export class OnlineOrderItemDetailComponent implements OnInit {
    onlineOrderItem: IOnlineOrderItem;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ onlineOrderItem }) => {
            this.onlineOrderItem = onlineOrderItem;
        });
    }

    previousState() {
        window.history.back();
    }
}
