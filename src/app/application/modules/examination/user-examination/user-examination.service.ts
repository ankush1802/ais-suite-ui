import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, filter, of, switchMap, throwError } from "rxjs";
import { Examination } from "../examination.model";

@Injectable()
export class UserExaminationService {
    examUrl: string = "api/exam/getbyid";
    private selectedExaminationSubject = new BehaviorSubject<Examination | undefined>(undefined);
    readonly examinationSelected$ = this.selectedExaminationSubject.asObservable();

    readonly examination$ = this.examinationSelected$
        .pipe(
            filter(Boolean),
            switchMap(id => {
                const examUrl = this.examUrl + '/' + id;
                return this.http.get<Examination>(examUrl)
                    .pipe(
                        //switchMap(exam => )
                        catchError(err => this.handleError(err))
                    );
            })
        );

    selectedExaminationChanged(selectedExaminationId: Examination): void {
        this.selectedExaminationSubject.next(selectedExaminationId);
    }

    readonly examinations$ = of([
        {
            id: "1",
            code: "AAAA",
            description: "test desc",
            name: "Test 1",
            questions: [
                {
                    index : 0,
                    question: "Q1",
                    options: [
                        "Option 1",
                        "Option 2",
                        "Option 3",
                        "Option 4"
                    ]
                },
                {
                    index : 1,
                    question: "Q2",
                    options: [
                        "Option 1",
                        "Option 2",
                        "Option 3",
                        "Option 4"
                    ]
                }
            ]
        },
        {
            id: "2",
            code: "AAAB",
            description: "test desc",
            name: "Test 2",
            questions: [
                {
                    index : 0,
                    question: "Q1",
                    options: [
                        "Option 1",
                        "Option 2",
                        "Option 3",
                        "Option 4"
                    ]
                },
                {
                    index : 1,
                    question: "Q2",
                    options: [
                        "Option 1",
                        "Option 2",
                        "Option 3",
                        "Option 4"
                    ]
                }
            ]
        }]);
    constructor(protected http: HttpClient) { }

    private handleError(err: HttpErrorResponse): Observable<never> {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Backend returned code ${err.status}: ${err.message}`;
        }
        console.error(err);
        return throwError(() => errorMessage);
    }
}