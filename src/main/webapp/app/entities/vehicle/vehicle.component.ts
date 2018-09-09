import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Principal } from 'app/core';
import { IVehicle, Vehicle } from 'app/shared/model/vehicle.model';
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
        mode: 'inline',
        actions: {
            columnTitle: '',
            add: true,
            edit: true,
            delete: false,
            custom: [
                {
                    name: 'view',
                    title: 'View ',
                },
                {
                    name: 'delete',
                    title: 'Delete ',
                }
            ]
        },
        add: {
            confirmCreate: true, // triggers createConfirm event
        },
        edit: {
            confirmSave: true, // triggers editConfirm event
        },
        columns: {
            id: {
                title: 'ID',
                addable: false,
                editable: false
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
        },
        attr: {
            class: 'table table-hover table-bordered text-nowrap'
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
        private principal: Principal,
        private router: Router
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

    onAdd(event) {
        console.log('test VehicleComponent onAdd() event:', event);
        const item: Vehicle = event.newData;

        if (!this.isInputValid(item)) {
            event.confirm.reject(); // cannot save and must click the cancel button
        } else {
            event.confirm.resolve(item); // updates table and localDataSource
        }
    }

    onEdit(event) {
        console.log('test VehicleComponent onEdit() event:', event);
        const item: Vehicle = event.newData;

        if (!this.isInputValid(item)) {
            event.confirm.reject();
        } else {
            event.confirm.resolve(item);
        }
    }

    isInputValid(item: Vehicle): boolean {
        return true;
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

    onCustom(event) {
        if (event.action === 'view') {
            this.router.navigate(['vehicle/' + event.data.id + '/view']);
        } else if (event.action === 'delete') {
            this.router.navigate([{ outlets: { popup: 'vehicle/' + event.data.id + '/delete' } }]);
        }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

}
