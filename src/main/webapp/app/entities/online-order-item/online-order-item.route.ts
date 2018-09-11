import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { IOnlineOrderItem, OnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { OnlineOrderItemDeletePopupComponent } from './online-order-item-delete-dialog.component';
import { OnlineOrderItemDetailComponent } from './online-order-item-detail.component';
import { OnlineOrderItemUpdateComponent } from './online-order-item-update.component';
import { OnlineOrderItemComponent } from './online-order-item.component';
import { OnlineOrderItemService } from './online-order-item.service';

@Injectable({ providedIn: 'root' })
export class OnlineOrderItemResolve implements Resolve<IOnlineOrderItem> {

    constructor(private service: OnlineOrderItemService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((onlineOrderItem: HttpResponse<OnlineOrderItem>) => onlineOrderItem.body));
        }
        return of(new OnlineOrderItem());
    }

}

export const onlineOrderItemRoute: Routes = [
    {
        path: 'online-order-item',
        component: OnlineOrderItemComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.onlineOrderItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'online-order/:orderId/online-order-item/:id/view',
        component: OnlineOrderItemDetailComponent,
        resolve: {
            onlineOrderItem: OnlineOrderItemResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.onlineOrderItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'online-order/:orderId/online-order-item/new',
        component: OnlineOrderItemUpdateComponent,
        resolve: {
            onlineOrderItem: OnlineOrderItemResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.onlineOrderItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'online-order/:orderId/online-order-item/:id/edit',
        component: OnlineOrderItemUpdateComponent,
        resolve: {
            onlineOrderItem: OnlineOrderItemResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.onlineOrderItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const onlineOrderItemPopupRoute: Routes = [
    {
        path: 'online-order-item/:id/delete',
        component: OnlineOrderItemDeletePopupComponent,
        resolve: {
            onlineOrderItem: OnlineOrderItemResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.onlineOrderItem.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
