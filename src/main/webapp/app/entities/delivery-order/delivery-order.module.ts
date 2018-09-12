import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BrezaSharedModule } from 'app/shared';
import {
    DeliveryOrderComponent,
    DeliveryOrderDetailComponent,
    DeliveryOrderUpdateComponent,
    DeliveryOrderDeletePopupComponent,
    DeliveryOrderDeleteDialogComponent,
    deliveryOrderRoute,
    deliveryOrderPopupRoute
} from './';

const ENTITY_STATES = [...deliveryOrderRoute, ...deliveryOrderPopupRoute];

@NgModule({
    imports: [BrezaSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        DeliveryOrderComponent,
        DeliveryOrderDetailComponent,
        DeliveryOrderUpdateComponent,
        DeliveryOrderDeleteDialogComponent,
        DeliveryOrderDeletePopupComponent
    ],
    entryComponents: [
        DeliveryOrderComponent,
        DeliveryOrderUpdateComponent,
        DeliveryOrderDeleteDialogComponent,
        DeliveryOrderDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrezaDeliveryOrderModule {}
