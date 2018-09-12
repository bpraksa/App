import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeliveryOrder } from 'app/shared/model/delivery-order.model';
import { DeliveryOrderService } from './delivery-order.service';
import { DeliveryOrderComponent } from './delivery-order.component';
import { DeliveryOrderDetailComponent } from './delivery-order-detail.component';
import { DeliveryOrderUpdateComponent } from './delivery-order-update.component';
import { DeliveryOrderDeletePopupComponent } from './delivery-order-delete-dialog.component';
import { IDeliveryOrder } from 'app/shared/model/delivery-order.model';

@Injectable({ providedIn: 'root' })
export class DeliveryOrderResolve implements Resolve<IDeliveryOrder> {
    constructor(private service: DeliveryOrderService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((deliveryOrder: HttpResponse<DeliveryOrder>) => deliveryOrder.body));
        }
        return of(new DeliveryOrder());
    }
}

export const deliveryOrderRoute: Routes = [
    {
        path: 'delivery-order',
        component: DeliveryOrderComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.deliveryOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'delivery-order/:id/view',
        component: DeliveryOrderDetailComponent,
        resolve: {
            deliveryOrder: DeliveryOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.deliveryOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'delivery-order/new',
        component: DeliveryOrderUpdateComponent,
        resolve: {
            deliveryOrder: DeliveryOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.deliveryOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'delivery-order/:id/edit',
        component: DeliveryOrderUpdateComponent,
        resolve: {
            deliveryOrder: DeliveryOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.deliveryOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const deliveryOrderPopupRoute: Routes = [
    {
        path: 'delivery-order/:id/delete',
        component: DeliveryOrderDeletePopupComponent,
        resolve: {
            deliveryOrder: DeliveryOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.deliveryOrder.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
