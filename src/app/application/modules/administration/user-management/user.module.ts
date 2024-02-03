import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SharedModule } from 'src/app/application/common/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { ManageUserComponent } from './user-manage/user-manage.component';
import { UserService } from './user.service';
@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [UserListComponent,ManageUserComponent],
     // A list of services this child module shares between components.
     providers: [
        MessageService,
        UserService
    ]
})
export class UserModule { }
