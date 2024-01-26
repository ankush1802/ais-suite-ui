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

    submitted: boolean = false;

    constructor(
        private entityProvider: EntityService,
        private messageService: MessageService
    ) {}
    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges) {
        // changes.prop contains the old and the new value...
    }
    hideDialog() {
        this.closeEntityManageDialogEvent.emit(false);
        this.submitted = false;
    }

    saveEntity() {
        this.submitted = true;
        if (this.entity.title?.trim()) {
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
        }
    }
}
