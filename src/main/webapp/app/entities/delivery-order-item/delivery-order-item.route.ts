import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';
import { DeliveryOrderItemService } from './delivery-order-item.service';
import { DeliveryOrderItemComponent } from './delivery-order-item.component';
import { DeliveryOrderItemDetailComponent } from './delivery-order-item-detail.component';
import { DeliveryOrderItemUpdateComponent } from './delivery-order-item-update.component';
import { DeliveryOrderItemDeletePopupComponent } from './delivery-order-item-delete-dialog.component';
import { IDeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';

@Injectable({ providedIn: 'root' })
export class DeliveryOrderItemResolve implements Resolve<IDeliveryOrderItem> {
    constructor(private service: DeliveryOrderItemService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((deliveryOrderItem: HttpResponse<DeliveryOrderItem>) => deliveryOrderItem.body));
        }
        return of(new DeliveryOrderItem());
    }
}

export const deliveryOrderItemRoute: Routes = [
    {
        path: 'delivery-order-item',
        component: DeliveryOrderItemComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.deliveryOrderItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'delivery-order-item/:id/view',
        component: DeliveryOrderItemDetailComponent,
        resolve: {
            deliveryOrderItem: DeliveryOrderItemResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.deliveryOrderItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'delivery-order-item/new',
        component: DeliveryOrderItemUpdateComponent,
        resolve: {
            deliveryOrderItem: DeliveryOrderItemResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.deliveryOrderItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'delivery-order-item/:id/edit',
        component: DeliveryOrderItemUpdateComponent,
        resolve: {
            deliveryOrderItem: DeliveryOrderItemResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.deliveryOrderItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const deliveryOrderItemPopupRoute: Routes = [
    {
        path: 'delivery-order-item/:id/delete',
        component: DeliveryOrderItemDeletePopupComponent,
        resolve: {
            deliveryOrderItem: DeliveryOrderItemResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.deliveryOrderItem.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
