import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BrezaSharedModule } from 'app/shared';
import {
    OnlineOrderComponent,
    OnlineOrderDetailComponent,
    OnlineOrderUpdateComponent,
    OnlineOrderDeletePopupComponent,
    OnlineOrderDeleteDialogComponent,
    onlineOrderRoute,
    onlineOrderPopupRoute,
    TestButtonComponent
} from './';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BrezaOnlineOrderItemModule } from 'app/entities/online-order-item/online-order-item.module';

const ENTITY_STATES = [...onlineOrderRoute, ...onlineOrderPopupRoute];

@NgModule({
    imports: [BrezaSharedModule, RouterModule.forChild(ENTITY_STATES), Ng2SmartTableModule, BrezaOnlineOrderItemModule],
    declarations: [
        OnlineOrderComponent,
        OnlineOrderDetailComponent,
        OnlineOrderUpdateComponent,
        OnlineOrderDeleteDialogComponent,
        OnlineOrderDeletePopupComponent,
        TestButtonComponent
    ],
    entryComponents: [OnlineOrderComponent, OnlineOrderUpdateComponent, OnlineOrderDeleteDialogComponent, OnlineOrderDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrezaOnlineOrderModule {}
