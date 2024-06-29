import { NgModule } from '@angular/core';
import { ExaminationRoutingModule } from './examination-routing.module';
import { UserExaminationModule } from './user-examination/user-examination.module';

@NgModule({
    imports:
    [
        UserExaminationModule,
        ExaminationRoutingModule
    ],
    declarations: []
})
export class ExaminationModule { }
