import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Principal } from 'app/core';
import { IDeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { DeliveryOrderItemService } from './delivery-order-item.service';

@Component({
    selector: 'jhi-delivery-order-item',
    templateUrl: './delivery-order-item.component.html'
})
export class DeliveryOrderItemComponent implements OnInit, OnDestroy {

    deliveryOrderId: number;
    deliveryOrderItems: IDeliveryOrderItem[];

    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private deliveryOrderItemService: DeliveryOrderItemService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        console.log('test DeliveryOrderItem ngOnInit() ran');
        this.loadAll();

        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInDeliveryOrderItems();
    }

    loadAll() {
        this.route.params.subscribe(params => {
            this.deliveryOrderId = params['id'];
        });

        this.deliveryOrderItemService.findByDeliveryOrderId(this.deliveryOrderId).subscribe(
            (res: HttpResponse<IDeliveryOrderItem[]>) => {
                console.log('test DeliveryOrderItem loadAll() response:', res.body);
                this.deliveryOrderItems = res.body;
            },
            (res: HttpErrorResponse) => console.log('test DeliveryOrderItem loadAll() response:', res)
        );
    }

    registerChangeInDeliveryOrderItems() {
        this.eventSubscriber = this.eventManager.subscribe('deliveryOrderItemListModification', response => this.loadAll());
    }

    trackId(index: number, item: IDeliveryOrderItem) {
        return item.id;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    ngOnDestroy() {
        console.log('test DeliveryOrderItem ngOnDestroy() ran');
        this.eventManager.destroy(this.eventSubscriber);
    }

}
