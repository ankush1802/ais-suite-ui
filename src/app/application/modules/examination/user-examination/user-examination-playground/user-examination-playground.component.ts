import { Component } from "@angular/core";
import { EMPTY, Subject, catchError, combineLatest, filter, map } from "rxjs";
import { UserExaminationService } from "../user-examination.service";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  templateUrl: './user-examination-playground.component.html',
  styleUrl: './user-examination-playground.component.scss'
})
export class UserExaminationPlaygroundComponent {

  currentQuestionIndex : number = 0;

  steps: any[] = [
    { label: 'Step 1' },
    { label: 'Step 2' },
    { label: 'Review & Submit' }
  ];
  activeIndex: number = 0;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  examination$ = this.examinationService.examinationSelected$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  pageTitle$ = this.examination$
    .pipe(
      map(p => p ? `Exam Detail for: ${p.name}` : null)
    );

  vm$ = combineLatest([
    this.examination$,
    this.pageTitle$
  ])
    .pipe(
      filter(([examination]) => Boolean(examination)),
      map(([examination, pageTitle]) =>
        ({ examination, pageTitle }))
    );

  constructor(private examinationService: UserExaminationService) { }

  formGroup: FormGroup = new FormGroup({
    selectedCategory: new FormControl()
});;

  SubmitAnswer(i : number){
    this.currentQuestionIndex++;
  }
}