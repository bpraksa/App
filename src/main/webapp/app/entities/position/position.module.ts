import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BrezaSharedModule } from 'app/shared';
import {
    PositionComponent,
    PositionDetailComponent,
    PositionUpdateComponent,
    PositionDeletePopupComponent,
    PositionDeleteDialogComponent,
    positionRoute,
    positionPopupRoute
} from './';
import { Ng2SmartTableModule } from 'ng2-smart-table';

const ENTITY_STATES = [...positionRoute, ...positionPopupRoute];

@NgModule({
    imports: [BrezaSharedModule, RouterModule.forChild(ENTITY_STATES), Ng2SmartTableModule],
    declarations: [
        PositionComponent,
        PositionDetailComponent,
        PositionUpdateComponent,
        PositionDeleteDialogComponent,
        PositionDeletePopupComponent
    ],
    entryComponents: [PositionComponent, PositionUpdateComponent, PositionDeleteDialogComponent, PositionDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrezaPositionModule {}
