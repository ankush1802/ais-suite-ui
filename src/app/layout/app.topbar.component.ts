import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { AuthService, User } from '../application/core/authentication';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrl: './app.topbar.component.scss',
})
export class AppTopBarComponent {
    items!: MenuItem[];
    user!: User;
    menuToolbarItems: MenuItem[] = [];
    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private auth: AuthService
    ) {}
    ngOnInit(): void {
        this.user = this.auth.getUser();
        this.menuToolbarItems = [
            {
                label: this.user.name,
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: '/documentation',
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-power-off',
                        command: () => {
                            this.logout();
                        },
                    },
                ],
            }
        ];
    }
    logout() {
        this.auth.logout();
        this.router.navigateByUrl('/auth/login');
    }
}
