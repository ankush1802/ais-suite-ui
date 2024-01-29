import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { EntityService } from '../entity.service';
import { Entity } from '../entity.model';
import { MessageService } from 'primeng/api';
import { MessageResponse } from 'src/app/application/common/shared-models/shared.model';
import { HttpStatusCode } from '@angular/common/http';

@Component({
    selector: 'app-manage-entity',
    templateUrl: './entity-manage.component.html',
})
export class ManageEntityComponent implements OnInit {
    @Input() showEntityManageDialog: boolean;
    @Output() closeEntityManageDialogEvent = new EventEmitter<boolean>();
    @Output() refreshEntityGridDialogEvent = new EventEmitter<boolean>();
    @Input() entity: Entity;
    nodes!: any[];
    selectedNodes: any;
    submitted: boolean = false;

    constructor(
        private entityProvider: EntityService,
        private messageService: MessageService
    ) {

    }
    ngOnInit(): void {}
    ngOnChanges(changes: any) {
        // changes.prop contains the old and the new value...
        debugger;
        // const showEntityManageDialogValueChange = changes.showEntityManageDialog as any;
        // if(showEntityManageDialogValueChange && showEntityManageDialogValueChange.currentValue){

        // }
        if (this.showEntityManageDialog) {
            this.entityProvider
                .getEntityTree({ id: 0 })
                .subscribe((response: MessageResponse) => {
                    if (response.statusCode === HttpStatusCode.Ok) {
                        this.nodes = response.result;
                        if (
                            this.entity.id > 0 &&
                            this.entity.parent_id &&
                            this.entity.parent_id > 0
                        ) {
                            this.selectedNodes = this.nodes.filter(
                                (f) => f.key == this.entity.parent_id
                            );
                        } else {
                            this.selectedNodes = this.nodes[0];
                        }
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
    hideDialog() {
        this.closeEntityManageDialogEvent.emit(false);
        this.submitted = false;
    }

    saveEntity() {
        this.submitted = true;
        if (this.entity.title?.trim() && this.selectedNodes) {
            this.entity.parent_id = this.selectedNodes.key;
            this.entityProvider
                .saveEntity(this.entity)
                .subscribe((response: MessageResponse) => {
                    debugger;
                    this.submitted = false;
                    if (response.statusCode === HttpStatusCode.Ok) {
                        if (this.entity.id) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Entity Updated',
                                life: 3000,
                            });
                        } else {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Entity Created Successfully',
                                life: 3000,
                            });
                        }
                        this.closeEntityManageDialogEvent.emit(false);
                        this.refreshEntityGridDialogEvent.emit(true);
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: response.errorMessage,
                            life: 3000,
                        });
                    }
                });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill the required information(s).',
                life: 3000,
            });
        }
    }
}
