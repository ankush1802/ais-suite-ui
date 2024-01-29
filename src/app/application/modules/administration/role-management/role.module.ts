import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationDialogComponent } from 'src/app/application/common/confirmation-dialog/confirmation-dialog.component';
import { SharedModule } from 'src/app/application/common/shared.module';
import { RoleService } from './role.service';
import { RoleListComponent } from './role-list/role-list.component';
import { ManageRoleComponent } from './role-manage/role-manage.component';
@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [RoleListComponent,ManageRoleComponent],
     // A list of services this child module shares between components.
     providers: [
        MessageService,
        RoleService
    ]
})
export class RoleModule { }
