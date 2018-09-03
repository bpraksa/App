import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BrezaSharedModule } from 'app/shared';
import {
    ClientComponent,
    ClientDetailComponent,
    ClientUpdateComponent,
    ClientDeletePopupComponent,
    ClientDeleteDialogComponent,
    clientRoute,
    clientPopupRoute
} from './';
import { Ng2SmartTableModule } from 'ng2-smart-table';

const ENTITY_STATES = [...clientRoute, ...clientPopupRoute];

@NgModule({
    imports: [BrezaSharedModule, RouterModule.forChild(ENTITY_STATES), Ng2SmartTableModule],
    declarations: [ClientComponent, ClientDetailComponent, ClientUpdateComponent, ClientDeleteDialogComponent, ClientDeletePopupComponent],
    entryComponents: [ClientComponent, ClientUpdateComponent, ClientDeleteDialogComponent, ClientDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrezaClientModule {}
