import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OnlineOrder } from 'app/shared/model/online-order.model';
import { OnlineOrderService } from './online-order.service';
import { OnlineOrderComponent } from './online-order.component';
import { OnlineOrderDetailComponent } from './online-order-detail.component';
import { OnlineOrderUpdateComponent } from './online-order-update.component';
import { OnlineOrderDeletePopupComponent } from './online-order-delete-dialog.component';
import { IOnlineOrder } from 'app/shared/model/online-order.model';

@Injectable({ providedIn: 'root' })
export class OnlineOrderResolve implements Resolve<IOnlineOrder> {
    constructor(private service: OnlineOrderService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((onlineOrder: HttpResponse<OnlineOrder>) => onlineOrder.body));
        }
        return of(new OnlineOrder());
    }
}

export const onlineOrderRoute: Routes = [
    {
        path: 'online-order',
        component: OnlineOrderComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.onlineOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'online-order/:id/view',
        component: OnlineOrderDetailComponent,
        resolve: {
            onlineOrder: OnlineOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.onlineOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'online-order/new',
        component: OnlineOrderUpdateComponent,
        resolve: {
            onlineOrder: OnlineOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.onlineOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'online-order/:id/edit',
        component: OnlineOrderUpdateComponent,
        resolve: {
            onlineOrder: OnlineOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.onlineOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const onlineOrderPopupRoute: Routes = [
    {
        path: 'online-order/:id/delete',
        component: OnlineOrderDeletePopupComponent,
        resolve: {
            onlineOrder: OnlineOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.onlineOrder.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
