import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { DeliveryOrderItemComponent } from 'app/entities/delivery-order-item';
import { DeliveryOrder, IDeliveryOrder } from 'app/shared/model/delivery-order.model';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DeliveryOrderDeletePopupComponent } from './delivery-order-delete-dialog.component';
import { DeliveryOrderDetailComponent } from './delivery-order-detail.component';
import { DeliveryOrderUpdateComponent } from './delivery-order-update.component';
import { DeliveryOrderComponent } from './delivery-order.component';
import { DeliveryOrderService } from './delivery-order.service';

@Injectable({ providedIn: 'root' })
export class DeliveryOrderResolve implements Resolve<IDeliveryOrder> {

    constructor(private service: DeliveryOrderService) { }

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
        canActivate: [UserRouteAccessService],
        children: [
            {
                path: '',
                component: DeliveryOrderItemComponent,
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'brezaApp.deliveryOrderItem.home.title'
                },
                canActivate: [UserRouteAccessService],
                outlet: 'delivery-item'
            }
        ]
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
        canActivate: [UserRouteAccessService],
        // children: [
        //     {
        //         path: '',
        //         component: DeliveryOrderItemComponent,
        //         data: {
        //             authorities: ['ROLE_USER'],
        //             pageTitle: 'brezaApp.deliveryOrderItem.home.title'
        //         },
        //         canActivate: [UserRouteAccessService],
        //         outlet: 'delivery-item'
        //     }
        // ]
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
        canActivate: [UserRouteAccessService],
        children: [
            {
                path: '',
                component: DeliveryOrderItemComponent,
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'brezaApp.deliveryOrderItem.home.title'
                },
                canActivate: [UserRouteAccessService],
                outlet: 'delivery-item'
            }
        ]
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
