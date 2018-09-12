import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IDeliveryOrder } from 'app/shared/model/delivery-order.model';
import { Principal } from 'app/core';
import { DeliveryOrderService } from './delivery-order.service';

@Component({
    selector: 'jhi-delivery-order',
    templateUrl: './delivery-order.component.html'
})
export class DeliveryOrderComponent implements OnInit, OnDestroy {
    deliveryOrders: IDeliveryOrder[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private deliveryOrderService: DeliveryOrderService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.deliveryOrderService.query().subscribe(
            (res: HttpResponse<IDeliveryOrder[]>) => {
                this.deliveryOrders = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInDeliveryOrders();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IDeliveryOrder) {
        return item.id;
    }

    registerChangeInDeliveryOrders() {
        this.eventSubscriber = this.eventManager.subscribe('deliveryOrderListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
