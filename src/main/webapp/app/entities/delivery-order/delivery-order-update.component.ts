import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IDeliveryOrder } from 'app/shared/model/delivery-order.model';
import { DeliveryOrderService } from './delivery-order.service';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee';
import { IVehicle } from 'app/shared/model/vehicle.model';
import { VehicleService } from 'app/entities/vehicle';
import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { OnlineOrderService } from 'app/entities/online-order';

@Component({
    selector: 'jhi-delivery-order-update',
    templateUrl: './delivery-order-update.component.html'
})
export class DeliveryOrderUpdateComponent implements OnInit {
    private _deliveryOrder: IDeliveryOrder;
    isSaving: boolean;

    employees: IEmployee[];

    vehicles: IVehicle[];

    onlineorders: IOnlineOrder[];
    deliveryDateDp: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private deliveryOrderService: DeliveryOrderService,
        private employeeService: EmployeeService,
        private vehicleService: VehicleService,
        private onlineOrderService: OnlineOrderService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ deliveryOrder }) => {
            this.deliveryOrder = deliveryOrder;
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
        result.subscribe((res: HttpResponse<IDeliveryOrder>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
}
