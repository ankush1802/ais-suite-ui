import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { EntityService } from '../entity.service';
import { MessageResponse } from 'src/app/application/common/shared-models/shared.model';
import { Entity, EntityList } from '../entity.model';

@Component({
    templateUrl: './entity-list.component.html',
    providers: [MessageService],
})
export class EntityListComponent implements OnInit {
    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private productService: ProductService,
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

    //#region entity
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
                sortOptions : {sortField : this.gridFilters.sortField, sortOrder : this.gridFilters.sortOrder === 1 ? 'asc': 'desc'}
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

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(
            (val) => !this.selectedProducts.includes(val)
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000,
        });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(
            (val) => val.id !== this.product.id
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000,
        });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    .value
                    ? this.product.inventoryStatus.value
                    : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] =
                    this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000,
                });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    ? this.product.inventoryStatus.value
                    : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000,
                });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
