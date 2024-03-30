import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { Role, RolesList } from '../role.model';
import { MessageResponse, NotificationModel } from 'src/app/application/common/shared-models/shared.model';
import { RoleService } from '../role.service';
import { Router } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';
import { CommonService } from 'src/app/application/common/shared-services/common.service';

@Component({
    templateUrl: './role-list.component.html',
    styleUrl: './role-list.component.scss',
})
export class RoleListComponent implements OnInit {
    //#region Variables
    userId: number = 1;
    breadcrumbItems: MenuItem[] = [];
    home: MenuItem | undefined;
    cols: any[] = [];
    role: RolesList;
    selectedRoles: RolesList[] = [];
    //#endregion

    //#region Angular Lifecycle
    ngOnInit(): void {
        this.loading = true;
        this.cols = [
            { field: 'id', header: 'id' },
            { field: 'title', header: 'Title' },
            { field: 'entity', header: 'Entity' },
        ];
        this.breadcrumbItems = [
            { label: 'Administration' },
            { label: 'Roles', routerLink: '/administration/roles' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/' };
        //this.roleServiceNotification();
    }
    constructor(
        private messageService: MessageService,
        private roleProvider: RoleService,
        private commonProvider: CommonService,
        private router: Router
    ) {
        this.roleServiceNotification();
    }
    //#endregion

    //#region role listing

    filters = [];
    isFirstLoad: boolean = true;
    pageSize = 10;
    pageIndex = 1;
    gridFilters: LazyLoadEvent;
    totalRecords!: number;
    loading: boolean = false;
    pageSizeOptions: number[] = [1, 5, 10, 25, 100];
    /** All retrieved reports with no filtering applied.*/
    public allRoles: RolesList[] = [];
    buildAndQuery() {
        this.loading = true;
        this.roleProvider
            .getAllRoles({
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
                this.allRoles = response.result.roles as RolesList[];
                this.totalRecords = response.result.total;
                this.isFirstLoad = false;
            });
    }

    loadRoles(event: LazyLoadEvent) {
        this.gridFilters = event;
        this.buildAndQuery();
    }
    pageChange(event: any) {
        this.pageIndex = event.first + 1;
        this.pageSize = event.rows;
    }
    //#endregion

    //#region Role Crud
    openNew() {
        this.router.navigateByUrl('/administration/manage-role');
    }
    editRole(role: RolesList) {
        this.router.navigateByUrl(`/administration/manage-role/${role.id}`);
    }
    deleteRoleDialog: boolean = false;
    msgDeleteRoleConfirmationDialog: string;
    deleteRole(role: RolesList) {
        this.role = role;
        this.deleteRoleDialog = true;
        this.msgDeleteRoleConfirmationDialog = `<span>Are you sure you want to delete <b>${role.title}</b>?</span>`;
    }
    deleteSelectedRoles() {
        const count = this.selectedRoles.length;
        this.msgDeleteRoleConfirmationDialog = `<span>Are you sure you want to delete <b>${count}</b> entities?</span>`;
        this.deleteRoleDialog = true;
    }
    closeConfirmationDialog(value: boolean) {
        this.deleteRoleDialog = value;
    }
    markRoleDelete(value: boolean) {
        if (value) {
            let rolesIds = [] as number[];
            if (this.selectedRoles.length > 0) {
                for (let i = 0; i < this.selectedRoles.length; i++) {
                    rolesIds.push(this.selectedRoles[i].id);
                }
            } else {
                rolesIds.push(this.role.id);
            }
            this.roleProvider
                .deleteRoles({ ids: rolesIds, createdBy: this.userId })
                .subscribe((response: MessageResponse) => {
                    if (response.statusCode === HttpStatusCode.Ok) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Role Deleted',
                            life: 3000,
                        });
                        this.buildAndQuery();
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
    }
    roleServiceNotification(){
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
