import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { Role, RolesList } from '../role.model';
import { MessageResponse } from 'src/app/application/common/shared-models/shared.model';
import { RoleService } from '../role.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './role-list.component.html',
    styleUrl: './role-list.component.scss',
})
export class RoleListComponent implements OnInit {
    breadcrumbItems: MenuItem[] = [];
    home: MenuItem | undefined;
    cols: any[] = [];
    selectedRoles: Role[] = [];
    ngOnInit(): void {
        this.loading = true;
        this.cols = [
            { field: 'id', header: 'id' },
            { field: 'title', header: 'Title' }
        ];
        this.breadcrumbItems = [
            { label: 'Administration' },
            { label: 'Roles', routerLink: '/administration/roles' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }
    constructor(
        private messageService: MessageService,
        private roleProvider: RoleService,
        private router: Router,
    ) {}
    //#region entity listing

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
                this.allRoles = response.result.entities as RolesList[];
                this.totalRecords = response.result.total;
                this.isFirstLoad = false;
            });
    }

    loadRoles(event: LazyLoadEvent) {
        this.gridFilters = event;
        this.buildAndQuery();
    }
    pageChange(event: any) {
        debugger;
        this.pageIndex = event.first + 1;
        this.pageSize = event.rows;
    }
    //#endregion

    openNew() {
        this.router.navigateByUrl('/administration/manage-role');
    }
}
