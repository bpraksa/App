import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BrezaSharedModule } from 'app/shared';
import {
    DeliveryOrderItemComponent,
    DeliveryOrderItemDetailComponent,
    DeliveryOrderItemUpdateComponent,
    DeliveryOrderItemDeletePopupComponent,
    DeliveryOrderItemDeleteDialogComponent,
    deliveryOrderItemRoute,
    deliveryOrderItemPopupRoute
} from './';

const ENTITY_STATES = [...deliveryOrderItemRoute, ...deliveryOrderItemPopupRoute];

@NgModule({
    imports: [BrezaSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        DeliveryOrderItemComponent,
        DeliveryOrderItemDetailComponent,
        DeliveryOrderItemUpdateComponent,
        DeliveryOrderItemDeleteDialogComponent,
        DeliveryOrderItemDeletePopupComponent
    ],
    entryComponents: [
        DeliveryOrderItemComponent,
        DeliveryOrderItemUpdateComponent,
        DeliveryOrderItemDeleteDialogComponent,
        DeliveryOrderItemDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrezaDeliveryOrderItemModule {}
