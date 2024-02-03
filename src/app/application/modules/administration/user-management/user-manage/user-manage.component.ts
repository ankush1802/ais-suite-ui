import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { EntityService } from '../../entity-management/entity.service';
import { RoleService } from '../../role-management/role.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageResponse } from 'src/app/application/common/shared-models/shared.model';
import { HttpStatusCode } from '@angular/common/http';
import { UserEntity } from '../user.model';
import { UserService } from '../user.service';

@Component({
    selector: 'app-manage-role',
    templateUrl: './user-manage.component.html',
})
export class ManageUserComponent implements OnInit {
    //#region Variables
    breadcrumbItems: MenuItem[] = [];
    home: MenuItem | undefined;
    nodes!: any[];
    selectedNodes: any;
    submitted: boolean = false;
    user: UserEntity = {} as UserEntity;
    // permissionGroups: PermissionGroup[];
    //#endregion

    //#region Angular lifecycle
    constructor(
        private entityProvider: EntityService,
        private roleProvider: RoleService,
        private userProvider: UserService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute
    ) {
        this.buildUserFormGroup();
    }
    async ngOnInit(): Promise<void> {
        await this.checkUserDetails();
        this.pageSetting();
        await this.getEntityTree();
    }
    //#endregion
    //#region page settings
    pageSetting() {
        this.breadcrumbItems = [
            { label: 'Administration' },
            { label: 'User(s)', routerLink: '/administration/users' },
            { label: 'Manage User' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }
    //#endregion

    //#region User Form Setup
    userForm: FormGroup;
    buildUserFormGroup() {
        this.userForm = this.fb.group({
            email: ['', Validators.required],
            firstname: ['', Validators.required],
            entity: ['', Validators.required],
            middlename: [''],
            lastname: [''],
            active: [''],
            description: [''],
            roles: [''],
        });
    }
    //#endregion

    //#region Helper Method(s)
    async checkUserDetails() {
        this.activatedRoute.params.subscribe(
            (params: any) => (this.user.id = params.id)
        );
        if (this.user.id && this.user.id > 0) {
            //retrieve role details first
            this.userProvider
                .getUserById({ id: this.user.id })
                .subscribe((response: MessageResponse) => {
                    if (response.statusCode === HttpStatusCode.Ok) {
                        this.user = response.result.role;
                        this.userForm.patchValue({
                            //title: this.user.title,
                            //description: this.user.description,
                        });
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
    async getEntityTree(): Promise<void> {
        this.entityProvider
            .getEntityTree({ id: 0 })
            .subscribe((response: MessageResponse) => {
                if (response.statusCode === HttpStatusCode.Ok) {
                    this.nodes = response.result;
                    if (
                        this.user.id > 0 &&
                        this.user.entityId &&
                        this.user.entityId > 0
                    ) {
                        const selectedEntity = this.nodes.filter(
                            (f) => f.key == this.user.entityId
                        );
                        this.userForm.patchValue({ entity: selectedEntity[0] });
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
    roles: any[] = [];
    async loadRoles() {
        debugger;
        const formValue = this.userForm.value;
        const entityId = formValue.entity.key;
        this.roleProvider
        .getAllRolesByEntity({ id: entityId })
        .subscribe((response: MessageResponse) => {
            if (response.statusCode === HttpStatusCode.Ok) {
                this.roles = response.result;
                if (
                    this.user.id > 0 &&
                    this.user.entityId &&
                    this.user.entityId > 0
                ) {
                    const selectedEntity = this.nodes.filter(
                        (f) => f.key == this.user.entityId
                    );
                    this.userForm.patchValue({ entity: selectedEntity[0] });
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
        debugger;
    }
    saveUser() {}
    //#endregion
}
