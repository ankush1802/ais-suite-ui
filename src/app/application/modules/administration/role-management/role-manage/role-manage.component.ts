import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Permission, PermissionGroup, Role } from '../role.model';
import { EntityService } from '../../entity-management/entity.service';
import { MessageResponse } from 'src/app/application/common/shared-models/shared.model';
import { HttpStatusCode } from '@angular/common/http';
import { RoleService } from '../role.service';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-manage-role',
    templateUrl: './role-manage.component.html',
})
export class ManageRoleComponent implements OnInit {
    //#region Variables
    breadcrumbItems: MenuItem[] = [];
    home: MenuItem | undefined;
    nodes!: any[];
    selectedNodes: any;
    submitted: boolean = false;
    role: Role = {} as Role;
    permissionGroups: PermissionGroup[];
    //#endregion

    //#region Role Form Setup
    roleForm: FormGroup;
    buildRoleFormGroup() {
        this.roleForm = this.fb.group({
            title: ['', Validators.required],
            entity: [''],
            description: [''],
            permissiongroups: this.fb.array([]),
        });
    }
    //Helper method, which returns the permissiongroups FormArray from the model
    permissiongroups(): FormArray {
        return this.roleForm.get('permissiongroups') as FormArray;
    }
    newPermissionGroup(permissionGroup: PermissionGroup): FormGroup {
        return this.fb.group({
            groupid: permissionGroup.groupid,
            grouptitle: permissionGroup.grouptitle,
            permissions: this.fb.array([]),
        });
    }
    addPermissionGroup(permissionGroup: PermissionGroup) {
        this.permissiongroups().push(this.newPermissionGroup(permissionGroup));
    }

    permissions(groupIndex: number): FormArray {
        return this.permissiongroups()
            .at(groupIndex)
            .get('permissions') as FormArray;
    }
    newPermission(permission: Permission): FormGroup {
        let permssionValue = false;
        if (
            this.role.id &&
            this.role.id > 0 &&
            this.role.permissions &&
            this.role.permissions.length > 0
        ) {
            const permissionIndex = this.role.permissions.findIndex(f=>f.permissionid === permission.permissionid);
            if(permissionIndex > -1){
                permssionValue = true;
            }
        }
        return this.fb.group({
            permissionid: permission.permissionid,
            permissiontitle: permission.permissiontitle,
            permissionvalue: permssionValue,
        });
    }
    addPermission(groupIndex: number, permission: Permission) {
        this.permissions(groupIndex).push(this.newPermission(permission));
    }
    permission_control(groupIndex: number, permIndex: number): any {
        const permissionarray = this.permissiongroups()
            .at(groupIndex)
            .get('permissions') as FormArray;
        return permissionarray.at(permIndex);
    }
    //#endregion

    //#region Angular lifecycle
    constructor(
        private entityProvider: EntityService,
        private roleProvider: RoleService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute
    ) {
        this.buildRoleFormGroup();
    }
    async ngOnInit(): Promise<void> {
        await this.checkRoleDetails();
        this.pageSetting();
        await this.getEntityTree();
        await this.getPermissions();
    }
    //#endregion

    //#region page settings
    pageSetting() {
        this.breadcrumbItems = [
            { label: 'Administration' },
            { label: 'Roles', routerLink: '/administration/roles' },
            { label: 'Manage Role' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }
    //#endregion

    //#region Helper Method(s)
    async checkRoleDetails() {
        this.activatedRoute.params.subscribe(
            (params: any) => (this.role.id = params.id)
        );
        if (this.role.id && this.role.id > 0) {
            //retrieve role details first
            this.roleProvider
                .getRoleById({ id: this.role.id })
                .subscribe((response: MessageResponse) => {
                    if (response.statusCode === HttpStatusCode.Ok) {
                        this.role = response.result.role;
                        this.roleForm.patchValue({
                            title: this.role.title,
                            description: this.role.description,
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
    async getEntityTree() {
        await this.entityProvider
            .getEntityTree({ id: 0 })
            .subscribe((response: MessageResponse) => {
                if (response.statusCode === HttpStatusCode.Ok) {
                    this.nodes = response.result;
                    if (
                        this.role.id > 0 &&
                        this.role.entityId &&
                        this.role.entityId > 0
                    ) {
                        const selectedEntity = this.nodes.filter(
                            (f) => f.key == this.role.entityId
                        );
                        this.roleForm.patchValue({ entity: selectedEntity[0] });
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
    async getPermissions() {
        await this.roleProvider
            .getAllPermissions()
            .subscribe((response: MessageResponse) => {
                if (response.statusCode === HttpStatusCode.Ok) {
                    this.permissionGroups = response.result;
                    this.bindPermissionGroups();
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
    bindPermissionGroups() {
        this.permissionGroups.forEach((group: PermissionGroup) => {
            this.addPermissionGroup(group);
        });
        this.bindPermissions();
    }
    bindPermissions() {
        this.permissionGroups.forEach(
            (element: PermissionGroup, index: number) => {
                element.permissions.forEach((permission: Permission) => {
                    this.addPermission(index, permission);
                });
            }
        );
    }
    checkUncheckAll(event: any, groupIndex: number) {
        const permissions = this.permissions(groupIndex);
        permissions.controls.forEach((control: FormGroup) => {
            control.patchValue({ permissionvalue: event.checked });
        });
    }
    saveRole() {
        const formValue = this.roleForm.value;
        if (formValue.entity) {
            if (formValue.title.trim().length > 0) {
                let roleRequest = {} as Role;
                roleRequest.createdBy = 1;
                if(this.role && this.role.id >0){
                    roleRequest.id = this.role.id;
                }
                roleRequest.description = formValue.description;
                roleRequest.entityId = formValue.entity.key;
                roleRequest.title = formValue.title;
                roleRequest.permissions = [] as Permission[];
                formValue.permissiongroups.forEach((group: any) => {
                    const permissions = group.permissions as any[];
                    const selectedPermissions = permissions.filter(
                        (d) => d.permissionvalue === true
                    );
                    if (selectedPermissions && selectedPermissions.length > 0) {
                        selectedPermissions.forEach(
                            (permission: Permission) => {
                                roleRequest.permissions.push(permission);
                            }
                        );
                    }
                });
                this.roleProvider
                    .saveRole(roleRequest)
                    .subscribe((response: MessageResponse) => {
                        if (response.statusCode === HttpStatusCode.Ok) {
                            if(roleRequest.id < 1){
                                this.roleForm.reset();
                            }
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Role Saved Successfully.',
                                life: 3000,
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
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please mention role title.',
                    life: 3000,
                });
            }
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please choose entity to create a role.',
                life: 3000,
            });
        }

        //check entity is selected or not
        //check form is valid or not
    }
    //#endregion
}
