import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { EntityService } from "../entity.service";
import { Entity } from "../entity.model";
import { MessageService } from "primeng/api";

@Component({
    selector: 'app-manage-entity',
    templateUrl: './entity-manage.component.html',
})
export class ManageEntityComponent implements OnInit {
    @Input() showEntityManageDialog : boolean;
    @Output() closeEntityManageDialogEvent = new EventEmitter<boolean>();
    @Input() entity: Entity;

    submitted: boolean = false;

    constructor(
        private entityProvider: EntityService,
        private messageService: MessageService,
    ) {}
    ngOnInit(): void {

    }
    ngOnChanges(changes: SimpleChanges) {
        debugger;
        // changes.prop contains the old and the new value...
      }
    hideDialog() {
        this.closeEntityManageDialogEvent.emit(false);
        this.submitted = false;
    }

    saveEntity() {
        this.submitted = true;

        if (this.entity.title?.trim()) {
            if (this.entity.id) {
                // @ts-ignore
                // this.product.inventoryStatus = this.product.inventoryStatus
                //     .value
                //     ? this.product.inventoryStatus.value
                //     : this.product.inventoryStatus;
                // this.products[this.findIndexById(this.entity.id)] =
                //     this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Entity Updated',
                    life: 3000,
                });
            } else {
                // this.product.id = this.createId();
                // this.product.code = this.createId();
                // this.product.image = 'product-placeholder.svg';
                // // @ts-ignore
                // this.product.inventoryStatus = this.product.inventoryStatus
                //     ? this.product.inventoryStatus.value
                //     : 'INSTOCK';
                // this.products.push(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Entity Created Successfully',
                    life: 3000,
                });
            }
            this.closeEntityManageDialogEvent.emit(false);
            this.entity = {};
        }
    }
}
