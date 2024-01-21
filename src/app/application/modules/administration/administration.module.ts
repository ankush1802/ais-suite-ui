import { NgModule } from '@angular/core';
import { AdministrationRoutingModule } from './administration-routing.module';
import { EntityModule } from './entity-management/entity.module';

@NgModule({
    imports:
    [
        EntityModule,
        AdministrationRoutingModule
    ],
    declarations: []
})
export class AdministrationModule { }
