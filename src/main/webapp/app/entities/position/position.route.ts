import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Position } from 'app/shared/model/position.model';
import { PositionService } from './position.service';
import { PositionComponent } from './position.component';
import { PositionDetailComponent } from './position-detail.component';
import { PositionUpdateComponent } from './position-update.component';
import { PositionDeletePopupComponent } from './position-delete-dialog.component';
import { IPosition } from 'app/shared/model/position.model';

@Injectable({ providedIn: 'root' })
export class PositionResolve implements Resolve<IPosition> {
    constructor(private service: PositionService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((position: HttpResponse<Position>) => position.body));
        }
        return of(new Position());
    }
}

export const positionRoute: Routes = [
    {
        path: 'position',
        component: PositionComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.position.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'position/:id/view',
        component: PositionDetailComponent,
        resolve: {
            position: PositionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.position.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'position/new',
        component: PositionUpdateComponent,
        resolve: {
            position: PositionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.position.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'position/:id/edit',
        component: PositionUpdateComponent,
        resolve: {
            position: PositionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.position.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const positionPopupRoute: Routes = [
    {
        path: 'position/:id/delete',
        component: PositionDeletePopupComponent,
        resolve: {
            position: PositionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.position.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
