import { Component } from "@angular/core";
import { Examination } from "../../examination.model";
import { UserExaminationService } from "../user-examination.service";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Component({
    templateUrl: './examination-dashboard.component.html',
    styleUrl: './examination-dashboard.component.scss'
})
export class ExaminationDashboardComponent {

    private errorMessageSubject = new Subject<string>();
    errorMessage$ = this.errorMessageSubject.asObservable();


    examinations$ = this.examinationService.examinations$;

    constructor(private examinationService: UserExaminationService,private router: Router) {

    }
    startExamination(exam: Examination) {
        this.examinationService.selectedExaminationChanged(exam);
        this.router.navigateByUrl('/ais-suite/examination/exam-playground');
    }
}