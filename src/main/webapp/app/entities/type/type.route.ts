import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Type } from 'app/shared/model/type.model';
import { TypeService } from './type.service';
import { TypeComponent } from './type.component';
import { TypeDetailComponent } from './type-detail.component';
import { TypeUpdateComponent } from './type-update.component';
import { TypeDeletePopupComponent } from './type-delete-dialog.component';
import { IType } from 'app/shared/model/type.model';

@Injectable({ providedIn: 'root' })
export class TypeResolve implements Resolve<IType> {
    constructor(private service: TypeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((type: HttpResponse<Type>) => type.body));
        }
        return of(new Type());
    }
}

export const typeRoute: Routes = [
    {
        path: 'type',
        component: TypeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.type.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'type/:id/view',
        component: TypeDetailComponent,
        resolve: {
            type: TypeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.type.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'type/new',
        component: TypeUpdateComponent,
        resolve: {
            type: TypeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.type.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'type/:id/edit',
        component: TypeUpdateComponent,
        resolve: {
            type: TypeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.type.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const typePopupRoute: Routes = [
    {
        path: 'type/:id/delete',
        component: TypeDeletePopupComponent,
        resolve: {
            type: TypeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.type.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
