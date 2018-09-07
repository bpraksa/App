import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Client, IClient } from 'app/shared/model/client.model';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClientDeletePopupComponent } from './client-delete-dialog.component';
import { ClientDetailComponent } from './client-detail.component';
import { ClientUpdateComponent } from './client-update.component';
import { ClientComponent } from './client.component';
import { ClientService } from './client.service';

@Injectable({ providedIn: 'root' })
export class ClientResolve implements Resolve<IClient> {
    constructor(private service: ClientService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((client: HttpResponse<Client>) => client.body));
        }
        return of(new Client());
    }
}

export const clientRoute: Routes = [
    {
        path: 'client',
        component: ClientComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.client.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'client/:id/view',
        component: ClientDetailComponent,
        resolve: {
            client: ClientResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.client.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'client/new',
        component: ClientUpdateComponent,
        resolve: {
            client: ClientResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.client.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'client/:id/edit',
        component: ClientUpdateComponent,
        resolve: {
            client: ClientResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.client.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const clientPopupRoute: Routes = [
    {
        path: 'client/:id/delete',
        component: ClientDeletePopupComponent,
        resolve: {
            client: ClientResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.client.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
