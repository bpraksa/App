import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IDeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';
import { DeliveryOrderItemService } from './delivery-order-item.service';
import { IDeliveryOrder } from 'app/shared/model/delivery-order.model';
import { DeliveryOrderService } from 'app/entities/delivery-order';
import { IOnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { OnlineOrderItemService } from 'app/entities/online-order-item';

@Component({
    selector: 'jhi-delivery-order-item-update',
    templateUrl: './delivery-order-item-update.component.html'
})
export class DeliveryOrderItemUpdateComponent implements OnInit {
    private _deliveryOrderItem: IDeliveryOrderItem;
    isSaving: boolean;

    deliveryorders: IDeliveryOrder[];

    onlineorderitems: IOnlineOrderItem[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private deliveryOrderItemService: DeliveryOrderItemService,
        private deliveryOrderService: DeliveryOrderService,
        private onlineOrderItemService: OnlineOrderItemService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ deliveryOrderItem }) => {
            this.deliveryOrderItem = deliveryOrderItem;
        });
        this.deliveryOrderService.query().subscribe(
            (res: HttpResponse<IDeliveryOrder[]>) => {
                this.deliveryorders = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.onlineOrderItemService.query({ filter: 'deliveryorderitem-is-null' }).subscribe(
            (res: HttpResponse<IOnlineOrderItem[]>) => {
                if (!this.deliveryOrderItem.onlineOrderItem || !this.deliveryOrderItem.onlineOrderItem.id) {
                    this.onlineorderitems = res.body;
                } else {
                    this.onlineOrderItemService.find(this.deliveryOrderItem.onlineOrderItem.id).subscribe(
                        (subRes: HttpResponse<IOnlineOrderItem>) => {
                            this.onlineorderitems = [subRes.body].concat(res.body);
                        },
                        (subRes: HttpErrorResponse) => this.onError(subRes.message)
                    );
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.deliveryOrderItem.id !== undefined) {
            this.subscribeToSaveResponse(this.deliveryOrderItemService.update(this.deliveryOrderItem));
        } else {
            this.subscribeToSaveResponse(this.deliveryOrderItemService.create(this.deliveryOrderItem));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IDeliveryOrderItem>>) {
        result.subscribe((res: HttpResponse<IDeliveryOrderItem>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackDeliveryOrderById(index: number, item: IDeliveryOrder) {
        return item.id;
    }

    trackOnlineOrderItemById(index: number, item: IOnlineOrderItem) {
        return item.id;
    }
    get deliveryOrderItem() {
        return this._deliveryOrderItem;
    }

    set deliveryOrderItem(deliveryOrderItem: IDeliveryOrderItem) {
        this._deliveryOrderItem = deliveryOrderItem;
    }
}
