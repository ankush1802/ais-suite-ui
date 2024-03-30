import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/application/core/authentication';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'ais-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {
    valCheck: string[] = ['remember'];
    rememberMe :boolean;
    password!: string;
    email!: string;

    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private auth: AuthService
    ) {}
    isSubmitting = false;
    login() {
        this.isSubmitting = true;

        this.auth
            .login(
                this.email,
                this.password,
                this.rememberMe
            )
            .pipe(filter((authenticated) => authenticated))
            .subscribe({
                next: () => {
                    this.router.navigateByUrl('/ais-suite');
                },
                error: (errorRes: HttpErrorResponse) => {
                    if (errorRes.status === 401) {
                        alert("Invalid Credentials!!");

                    }
                    this.isSubmitting = false;
                },
            });
    }
}
