import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrezaArticleModule } from './article/article.module';
import { BrezaCityModule } from './city/city.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        BrezaArticleModule,
        BrezaCityModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrezaEntityModule {}
