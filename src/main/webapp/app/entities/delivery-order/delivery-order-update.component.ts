import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeliveryOrderItemService } from 'app/entities/delivery-order-item';
import { EmployeeService } from 'app/entities/employee';
import { OnlineOrderService } from 'app/entities/online-order';
import { OnlineOrderItemService } from 'app/entities/online-order-item';
import { VehicleService } from 'app/entities/vehicle';
import { DeliveryOrderItem, IDeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';
import { DeliveryOrder, IDeliveryOrder } from 'app/shared/model/delivery-order.model';
import { IEmployee } from 'app/shared/model/employee.model';
import { IOnlineOrderItem, OnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { IVehicle } from 'app/shared/model/vehicle.model';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { DeliveryOrderService } from './delivery-order.service';

@Component({
    selector: 'jhi-delivery-order-update',
    templateUrl: './delivery-order-update.component.html'
})
export class DeliveryOrderUpdateComponent implements OnInit, OnDestroy {

    private _deliveryOrder: IDeliveryOrder;
    isSaving: boolean;

    employees: IEmployee[];
    vehicles: IVehicle[];
    onlineorders: IOnlineOrder[];
    deliveryDateDp: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private deliveryOrderService: DeliveryOrderService,
        private deliveryOrderItemService: DeliveryOrderItemService,
        private onlineOrderItemService: OnlineOrderItemService,
        private employeeService: EmployeeService,
        private vehicleService: VehicleService,
        private onlineOrderService: OnlineOrderService,
        private activatedRoute: ActivatedRoute,
        private eventManager: JhiEventManager
    ) { }

    ngOnInit() {
        console.log('test DeliveryOrderUpdate ngOnInit() ran');
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ deliveryOrder }) => {
            this.deliveryOrder = deliveryOrder;
            if (this.deliveryOrder && this.deliveryOrder.status === 'NEW') {
                this.deliveryOrder.status = 'ITEMS_CREATED';
                this.getOnlineOrderItems();
            }
        });
        this.employeeService.query().subscribe(
            (res: HttpResponse<IEmployee[]>) => {
                this.employees = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.vehicleService.query().subscribe(
            (res: HttpResponse<IVehicle[]>) => {
                this.vehicles = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.onlineOrderService.query({ filter: 'deliveryorder-is-null' }).subscribe(
            (res: HttpResponse<IOnlineOrder[]>) => {
                if (!this.deliveryOrder.onlineOrder || !this.deliveryOrder.onlineOrder.id) {
                    this.onlineorders = res.body;
                } else {
                    this.onlineOrderService.find(this.deliveryOrder.onlineOrder.id).subscribe(
                        (subRes: HttpResponse<IOnlineOrder>) => {
                            this.onlineorders = [subRes.body].concat(res.body);
                        },
                        (subRes: HttpErrorResponse) => this.onError(subRes.message)
                    );
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    getOnlineOrderItems() {
        this.onlineOrderItemService.findByOnlineOrderId(this.deliveryOrder.onlineOrder.id).subscribe((res: HttpResponse<IOnlineOrderItem[]>) => {
            const onlineOrderItems: OnlineOrderItem[] = res.body;
            console.log('test DeliveryOrderUpdate getOnlineOrderItems() onlineOrderItems:', onlineOrderItems);

            onlineOrderItems.forEach(orderItem => {
                this.createDeliveryOrderItem(orderItem);
            });

            this.eventManager.broadcast({ name: 'deliveryOrderItemListModification', content: 'OK' });
        }, (err: HttpErrorResponse) => this.onSaveError(err));
    }

    createDeliveryOrderItem(orderItem: OnlineOrderItem) {
        const deliveryOrderItem = new DeliveryOrderItem();
        deliveryOrderItem.onlineOrderItem = orderItem;
        deliveryOrderItem.deliveryOrder = this.deliveryOrder;

        this.deliveryOrderItemService.create((deliveryOrderItem)).subscribe((res: HttpResponse<IDeliveryOrderItem>) => {
            console.log('test DeliveryOrderUpdate createDeliveryOrderItem() item:', res.body);
        }, (err: HttpErrorResponse) => this.onSaveError(err));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;

        if (this.deliveryOrder.id !== undefined) {
            this.subscribeToSaveResponse(this.deliveryOrderService.update(this.deliveryOrder));
        } else {
            this.subscribeToSaveResponse(this.deliveryOrderService.create(this.deliveryOrder));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IDeliveryOrder>>) {
        result.subscribe((res: HttpResponse<IDeliveryOrder>) => {
            this.onSaveSuccess(res.body);
        }, (err: HttpErrorResponse) => this.onSaveError(err));
    }

    private onSaveSuccess(deliveryOrder: DeliveryOrder) {
        console.log('test DeliveryOrderUpdate onSaveSuccess() deliveryOrder:', deliveryOrder);
        this.isSaving = false;
        // this.previousState();
    }

    private onSaveError(err: HttpErrorResponse) {
        console.log('test DeliveryOrderUpdate onSaveError() ERROR:', err);
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackEmployeeById(index: number, item: IEmployee) {
        return item.id;
    }

    trackVehicleById(index: number, item: IVehicle) {
        return item.id;
    }

    trackOnlineOrderById(index: number, item: IOnlineOrder) {
        return item.id;
    }

    get deliveryOrder() {
        return this._deliveryOrder;
    }

    set deliveryOrder(deliveryOrder: IDeliveryOrder) {
        this._deliveryOrder = deliveryOrder;
    }

    ngOnDestroy(): void {
        console.log('test DeliveryOrderUpdate ngOnDestroy() ran');
    }

}
