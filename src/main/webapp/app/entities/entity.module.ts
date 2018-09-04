import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrezaArticleModule } from './article/article.module';
import { BrezaCityModule } from './city/city.module';
import { BrezaClientModule } from './client/client.module';
import { BrezaTypeModule } from './type/type.module';
import { BrezaPositionModule } from './position/position.module';
import { BrezaEmployeeModule } from './employee/employee.module';
import { BrezaVehicleModule } from './vehicle/vehicle.module';
import { BrezaOnlineOrderModule } from './online-order/online-order.module';
import { BrezaOnlineOrderItemModule } from './online-order-item/online-order-item.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        BrezaArticleModule,
        BrezaCityModule,
        BrezaClientModule,
        BrezaTypeModule,
        BrezaPositionModule,
        BrezaEmployeeModule,
        BrezaVehicleModule,
        BrezaOnlineOrderModule,
        BrezaOnlineOrderItemModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrezaEntityModule {}
