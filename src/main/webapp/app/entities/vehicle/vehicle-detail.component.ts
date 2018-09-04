import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVehicle } from 'app/shared/model/vehicle.model';

@Component({
    selector: 'jhi-vehicle-detail',
    templateUrl: './vehicle-detail.component.html'
})
export class VehicleDetailComponent implements OnInit {
    vehicle: IVehicle;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ vehicle }) => {
            this.vehicle = vehicle;
        });
    }

    previousState() {
        window.history.back();
    }
}
