import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Principal } from 'app/core';
import { IDeliveryOrder } from 'app/shared/model/delivery-order.model';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
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
    ) { }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInDeliveryOrders();
    }

    loadAll() {
        this.deliveryOrderService.query().subscribe(
            (res: HttpResponse<IDeliveryOrder[]>) => {
                this.deliveryOrders = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    registerChangeInDeliveryOrders() {
        this.eventSubscriber = this.eventManager.subscribe('deliveryOrderListModification', response => this.loadAll());
    }

    trackId(index: number, item: IDeliveryOrder) {
        return item.id;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

}
