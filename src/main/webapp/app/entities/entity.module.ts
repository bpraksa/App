import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrezaArticleModule } from './article/article.module';
import { BrezaCityModule } from './city/city.module';
import { BrezaClientModule } from './client/client.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        BrezaArticleModule,
        BrezaCityModule,
        BrezaClientModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrezaEntityModule {}
