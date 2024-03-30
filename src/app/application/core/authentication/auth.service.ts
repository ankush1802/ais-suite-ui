import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, merge, of } from 'rxjs';
import { catchError, map, share, switchMap, tap } from 'rxjs/operators';
import { User } from './interface';
import { LoginService } from './login.service';
import { TokenService } from './token.service';
import { filterObject, isEmptyObject } from './helpers';
import { base64 } from '../../common/app-util';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private user$ = new BehaviorSubject<User>({});
    private change$ = merge(
        this.tokenService.change(),
        this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
    ).pipe(
        switchMap(() => this.assignUser()),
        share()
    );

    constructor(
        private loginService: LoginService,
        private tokenService: TokenService
    ) {}

    init() {
        return new Promise<void>((resolve) =>
            this.change$.subscribe(() => resolve())
        );
    }

    change() {
        return this.change$;
    }

    check() {
        return this.tokenService.valid();
    }

    login(username: string, password: string, rememberMe = false) {
        return this.loginService.login(username, password, rememberMe).pipe(
            tap((token) => {
                this.tokenService.set(token);
            }),
            map(() => this.check())
        );
    }

    refresh() {
        return this.loginService
            .refresh(
                filterObject({
                    refresh_token: this.tokenService.getRefreshToken(),
                })
            )
            .pipe(
                catchError(() => of(undefined)),
                tap((token) => this.tokenService.set(token)),
                map(() => this.check())
            );
    }

    logout() {
        this.tokenService.clear();
        //this.check();
        // return this.loginService.logout().pipe(
        //     tap(() => this.tokenService.clear()),
        //     map(() => !this.check())
        // );
    }

    user() {
        return this.user$.pipe(share());
    }

    //   menu() {
    //     return iif(() => this.check(), this.loginService.menu(), of([]));
    //   }

    private assignUser() {
        if (!this.check()) {
            return of({}).pipe(tap((user) => this.user$.next(user)));
        }

        if (!isEmptyObject(this.user$.getValue())) {
            return of(this.user$.getValue());
        }

        // return this.loginService
        //     .me()
        //     .pipe(tap((user) => this.user$.next(user)));
        return this.getUser().pipe(tap((user) => this.user$.next(user)));
    }

    //#region get user
    getUser() {
        try {
            const now = new Date();
            const data = this.parseToken(this.tokenService.getBearerToken());
            return this.isExpired(data, now) ? null : data.user;
        } catch (e) {
            return null;
        }
    }
    private parseToken(accessToken: string) {
        const [, payload] = accessToken.split('.');

        return JSON.parse(base64.decode(payload));
    }

    private isExpired(data: any, now: Date) {
        const expiresIn = new Date();
        expiresIn.setTime(data.exp * 1000);
        const diff = this.dateToSeconds(expiresIn) - this.dateToSeconds(now);

        return diff <= 0;
    }

    private dateToSeconds(date: Date) {
        return Math.ceil(date.getTime() / 1000);
    }
    //#endregion
}
