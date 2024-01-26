import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { EntityService } from '../entity.service';
import { MessageResponse } from 'src/app/application/common/shared-models/shared.model';
import { Entity, EntityList } from '../entity.model';
import { HttpStatusCode } from '@angular/common/http';

@Component({
    templateUrl: './entity-list.component.html',
})
export class EntityListComponent implements OnInit {
    manageEntityDialogOpen: boolean = false;
    deleteEntityDialog: boolean = false;
    msgDeleteConfirmationDialog: string;

    deleteProductsDialog: boolean = false;

    entities: Entity[] = [];

    entity: Entity = {};

    selectedEntities: Entity[] = [];

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private messageService: MessageService,
        private entityProvider: EntityService
    ) {}

    ngOnInit() {
        this.cols = [
            { field: 'id', header: 'Product' },
            { field: 'title', header: 'Title' },
            { field: 'active', header: 'Status' },
        ];
        this.loading = true;
    }

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
    public allEntities: EntityList[] = [];
    buildAndQuery() {
        this.loading = true;
        console.log(this.gridFilters);

        this.entityProvider
            .getAllEntities({
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
                this.allEntities = response.result.entities as EntityList[];
                this.totalRecords = response.result.total;
                this.isFirstLoad = false;
            });
    }

    loadEntities(event: LazyLoadEvent) {
        this.gridFilters = event;
        this.buildAndQuery();
    }
    pageChange(event: any) {
        debugger;
        this.pageIndex = event.first + 1;
        this.pageSize = event.rows;
    }
    //#endregion

    //#region entity crud
    openNew() {
        this.entity = {};
        this.manageEntityDialogOpen = true;
    }
    closeEntityManageDialog(value: boolean) {
        this.manageEntityDialogOpen = value;
    }
    deleteEntity(entity: Entity) {
        this.entity = entity;
        this.deleteEntityDialog = true;
        this.msgDeleteConfirmationDialog = `<span>Are you sure you want to delete <b>${entity.title}</b>?</span>`;
    }
    closeConfirmationDialog(value: boolean) {
        this.deleteEntityDialog = value;
    }
    refreshEntityManageDialog(value: boolean) {
        if (value) {
            this.buildAndQuery();
        }
    }
    markEntityDelete(value: boolean) {
        if (value) {
            let entitiesIds = [] as number[];
            if (this.selectedEntities.length > 0) {
                for (let i = 0; i < this.selectedEntities.length; i++) {
                    entitiesIds.push(this.selectedEntities[i].id);
                }
            } else {
                entitiesIds.push(this.entity.id);
            }
            this.entityProvider
                .deleteEntities({ ids: entitiesIds })
                .subscribe((response: MessageResponse) => {
                    debugger;
                    if (response.statusCode === HttpStatusCode.Ok) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Entity Deleted',
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
    deleteSelectedEntities() {
        const count = this.selectedEntities.length;
        this.msgDeleteConfirmationDialog = `<span>Are you sure you want to delete <b>${count}</b> entities?</span>`;
        this.deleteEntityDialog = true;
    }
    editEntity(entity: Entity) {
        this.entityProvider
            .GetEntityById({
                id: entity.id,
            })
            .subscribe((response: MessageResponse) => {
                if (response.statusCode === HttpStatusCode.Ok) {
                    this.entity = response.result as Entity;
                    this.manageEntityDialogOpen = true;
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
    //#endregion
}
