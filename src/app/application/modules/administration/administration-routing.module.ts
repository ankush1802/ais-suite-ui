import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityListComponent } from './entity-management/entity-list/entity-list.component';

const routes: Routes = [
    {
        // Each route must define a top-level path to hold all of the child paths.
        // This enables us to lazy-load all of these components when we navigate to /fcm
        path: '',
        children: [
            { path: '', redirectTo: 'entities', pathMatch: 'full' },
            // { path: 'alert-centre', component: AlertCentreComponent, canActivate: [AuthGuard, FeatureToggleGuard] },
            { path: 'entities', component: EntityListComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdministrationRoutingModule {}
