import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SharedModule } from 'src/app/application/common/shared.module';
import { CommonService } from 'src/app/application/common/shared-services/common.service';
import { ExaminationDashboardComponent } from './examination-dashboard/examination-dashboard.component';
import { TableModule } from 'primeng/table';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { UserExaminationService } from './user-examination.service';
import { UserExaminationPlaygroundComponent } from './user-examination-playground/user-examination-playground.component';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
@NgModule({
    imports: [
        SharedModule,
        TableModule,
        StyleClassModule,
        ButtonModule,
        CardModule,
        ReactiveFormsModule,
        RadioButtonModule
    ],
    declarations: [
        ExaminationDashboardComponent,
        UserExaminationPlaygroundComponent
    ],
     // A list of services this child module shares between components.
     providers: [
        MessageService,
        CommonService,
        UserExaminationService
    ]
})
export class UserExaminationModule { }
