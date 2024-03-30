import { NgModule } from '@angular/core';
import { EntityListComponent } from './entity-list/entity-list.component';
import { EntityService } from './entity.service';
import { ManageEntityComponent } from './entity-manage/entity-manage.component';
import { MessageService } from 'primeng/api';
import { ConfirmationDialogComponent } from 'src/app/application/common/confirmation-dialog/confirmation-dialog.component';
import { SharedModule } from 'src/app/application/common/shared.module';
import { CommonService } from 'src/app/application/common/shared-services/common.service';
@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [EntityListComponent,ManageEntityComponent],
     // A list of services this child module shares between components.
     providers: [
        MessageService,
        CommonService,
        EntityService
    ]
})
export class EntityModule { }
