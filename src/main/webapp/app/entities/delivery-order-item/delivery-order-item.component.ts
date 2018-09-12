import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IDeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';
import { Principal } from 'app/core';
import { DeliveryOrderItemService } from './delivery-order-item.service';

@Component({
    selector: 'jhi-delivery-order-item',
    templateUrl: './delivery-order-item.component.html'
})
export class DeliveryOrderItemComponent implements OnInit, OnDestroy {
    deliveryOrderItems: IDeliveryOrderItem[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private deliveryOrderItemService: DeliveryOrderItemService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.deliveryOrderItemService.query().subscribe(
            (res: HttpResponse<IDeliveryOrderItem[]>) => {
                this.deliveryOrderItems = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInDeliveryOrderItems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IDeliveryOrderItem) {
        return item.id;
    }

    registerChangeInDeliveryOrderItems() {
        this.eventSubscriber = this.eventManager.subscribe('deliveryOrderItemListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
