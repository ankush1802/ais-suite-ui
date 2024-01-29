import { NgModule } from '@angular/core';
import { AdministrationRoutingModule } from './administration-routing.module';
import { EntityModule } from './entity-management/entity.module';
import { RoleModule } from './role-management/role.module';

@NgModule({
    imports:
    [
        EntityModule,
        RoleModule,
        AdministrationRoutingModule
    ],
    declarations: []
})
export class AdministrationModule { }
