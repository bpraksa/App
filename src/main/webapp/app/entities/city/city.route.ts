import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { City, ICity } from 'app/shared/model/city.model';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { CityDeletePopupComponent } from './city-delete-dialog.component';
import { CityDetailComponent } from './city-detail.component';
import { CityUpdateComponent } from './city-update.component';
import { CityComponent } from './city.component';
import { CityService } from './city.service';

@Injectable({ providedIn: 'root' })
export class CityResolve implements Resolve<ICity> {
    constructor(private service: CityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((city: HttpResponse<City>) => city.body));
        }
        return of(new City());
    }
}

export const cityRoute: Routes = [
    {
        path: 'city',
        component: CityComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.city.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'city/:id/view',
        component: CityDetailComponent,
        resolve: {
            city: CityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.city.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'city/new',
        component: CityUpdateComponent,
        resolve: {
            city: CityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.city.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'city/:id/edit',
        component: CityUpdateComponent,
        resolve: {
            city: CityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.city.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const cityPopupRoute: Routes = [
    {
        path: 'city/:id/delete',
        component: CityDeletePopupComponent,
        resolve: {
            city: CityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.city.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
