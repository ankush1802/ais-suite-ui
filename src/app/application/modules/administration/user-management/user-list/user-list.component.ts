import { Component, OnInit } from '@angular/core';
import { UserList } from '../user.model';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MessageResponse, NotificationModel } from 'src/app/application/common/shared-models/shared.model';
import { HttpStatusCode } from '@angular/common/http';
import { CommonService } from 'src/app/application/common/shared-services/common.service';

@Component({
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
    //#region Variables
    userId: number = 1;
    breadcrumbItems: MenuItem[] = [];
    home: MenuItem | undefined;
    cols: any[] = [];
    user: UserList;
    selectedUsers: UserList[] = [];
    loading: boolean = false;
    //#endregion

    //#region Angular Lifecycle
    ngOnInit(): void {
        this.loading = true;
        this.gridSettings();
        this.pageSetting();
    }
    constructor(
        private messageService: MessageService,
        private userProvider: UserService,
        private commonProvider: CommonService,
        private router: Router
    ) {}
    //#endregion

    //#region page settings
    pageSetting() {
        this.breadcrumbItems = [
            { label: 'Administration' },
            { label: 'User(s)', routerLink: '/administration/users' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }
    //#endregion

    //#region role listing

    filters = [];
    isFirstLoad: boolean = true;
    pageSize = 10;
    pageIndex = 1;
    gridFilters: LazyLoadEvent;
    totalRecords!: number;
    pageSizeOptions: number[] = [1, 5, 10, 25, 100];
    /** All retrieved reports with no filtering applied.*/
    public allUsers: UserList[] = [];
    buildAndQuery() {
        this.loading = true;
        this.userProvider
            .getAllUser({
                pagenumber: this.pageIndex,
                size: this.pageSize,
                sortOptions: {
                    sortField: this.gridFilters.sortField,
                    sortOrder:
                        this.gridFilters.sortOrder === 1 ? 'asc' : 'desc',
                },
            })
            .subscribe((response: MessageResponse) => {
                this.loading = false;
                if (response.statusCode === HttpStatusCode.Ok) {
                    this.allUsers = response.result.users as UserList[];
                    this.totalRecords = response.result.total;
                    this.isFirstLoad = false;
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: response.errorMessage,
                        life: 3000,
                    });
                }
            });
    }

    loadUsers(event: LazyLoadEvent) {
        this.gridFilters = event;
        this.buildAndQuery();
    }
    pageChange(event: any) {
        debugger;
        this.pageIndex = event.first + 1;
        this.pageSize = event.rows;
    }
    //#endregion

    //#region User Crud
    openNew() {
        this.router.navigateByUrl('/administration/manage-user');
    }
    //#endregion

    //#region Helper Methods
    gridSettings() {
        this.cols = [
            { field: 'id', header: 'id' },
            { field: 'title', header: 'Title' },
        ];
    }
    userServiceNotification(){
        this.commonProvider.showNotificationObservable.subscribe((response : NotificationModel) => {
            if (response) {
                this.messageService.add({
                    severity: response.type,
                    summary: response.title,
                    detail: response.message,
                    life: 3000,
                });
            }
          });
    }
    //#endregion
}
