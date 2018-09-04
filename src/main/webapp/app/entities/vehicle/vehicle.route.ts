import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehicle } from 'app/shared/model/vehicle.model';
import { VehicleService } from './vehicle.service';
import { VehicleComponent } from './vehicle.component';
import { VehicleDetailComponent } from './vehicle-detail.component';
import { VehicleUpdateComponent } from './vehicle-update.component';
import { VehicleDeletePopupComponent } from './vehicle-delete-dialog.component';
import { IVehicle } from 'app/shared/model/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleResolve implements Resolve<IVehicle> {
    constructor(private service: VehicleService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((vehicle: HttpResponse<Vehicle>) => vehicle.body));
        }
        return of(new Vehicle());
    }
}

export const vehicleRoute: Routes = [
    {
        path: 'vehicle',
        component: VehicleComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.vehicle.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'vehicle/:id/view',
        component: VehicleDetailComponent,
        resolve: {
            vehicle: VehicleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.vehicle.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'vehicle/new',
        component: VehicleUpdateComponent,
        resolve: {
            vehicle: VehicleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.vehicle.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'vehicle/:id/edit',
        component: VehicleUpdateComponent,
        resolve: {
            vehicle: VehicleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.vehicle.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const vehiclePopupRoute: Routes = [
    {
        path: 'vehicle/:id/delete',
        component: VehicleDeletePopupComponent,
        resolve: {
            vehicle: VehicleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.vehicle.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
