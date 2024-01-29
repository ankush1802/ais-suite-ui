import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityListComponent } from './entity-management/entity-list/entity-list.component';
import { RoleListComponent } from './role-management/role-list/role-list.component';
import { ManageRoleComponent } from './role-management/role-manage/role-manage.component';

const routes: Routes = [
    {
        // Each route must define a top-level path to hold all of the child paths.
        // This enables us to lazy-load all of these components when we navigate to /fcm
        path: '',
        children: [
            { path: '', redirectTo: 'entities', pathMatch: 'full' },
            // { path: 'alert-centre', component: AlertCentreComponent, canActivate: [AuthGuard, FeatureToggleGuard] },
            { path: 'entities', component: EntityListComponent },
            { path: 'roles', component: RoleListComponent },
            { path: 'manage-role', component: ManageRoleComponent },
            { path: 'manage-role/:id', component: ManageRoleComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdministrationRoutingModule {}
