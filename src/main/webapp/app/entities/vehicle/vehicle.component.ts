import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Principal } from 'app/core';
import { IVehicle } from 'app/shared/model/vehicle.model';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';

import { VehicleService } from './vehicle.service';

@Component({
    selector: 'jhi-vehicle',
    templateUrl: './vehicle.component.html'
})
export class VehicleComponent implements OnInit, OnDestroy {

    settings = {
        columns: {
            id: {
                title: 'ID'
            },
            vehicleNumber: {
                title: 'Vehicle Number'
            },
            brand: {
                title: 'Brand'
            },
            model: {
                title: 'Model'
            }
        }
    };

    data: LocalDataSource;
    vehicles: IVehicle[];

    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private vehicleService: VehicleService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) { }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInVehicles();
    }

    loadAll() {
        this.vehicleService.query().subscribe(
            (res: HttpResponse<IVehicle[]>) => {
                // this.vehicles = res.body;
                this.data = new LocalDataSource(res.body);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    trackId(index: number, item: IVehicle) {
        return item.id;
    }

    registerChangeInVehicles() {
        this.eventSubscriber = this.eventManager.subscribe('vehicleListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

}
