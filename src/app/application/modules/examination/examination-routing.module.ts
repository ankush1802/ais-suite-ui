import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExaminationDashboardComponent } from './user-examination/examination-dashboard/examination-dashboard.component';
import { UserExaminationPlaygroundComponent } from './user-examination/user-examination-playground/user-examination-playground.component';

const routes: Routes = [
    {
        // Each route must define a top-level path to hold all of the child paths.
        // This enables us to lazy-load all of these components when we navigate to /examination
        path: '',
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: ExaminationDashboardComponent },
            { path: 'exam-playground', component: UserExaminationPlaygroundComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ExaminationRoutingModule {}
