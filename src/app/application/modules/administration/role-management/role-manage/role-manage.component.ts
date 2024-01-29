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

@Component({
    selector: 'app-manage-role',
    templateUrl: './role-manage.component.html',
})
export class ManageRoleComponent implements OnInit {
    breadcrumbItems: MenuItem[] = [];
    home: MenuItem | undefined;
    nodes!: any[];
    selectedNodes: any;
    submitted: boolean = false;
    role: Role = {} as Role;
    permissionGroups: PermissionGroup[];

    //#region
    roleForm: FormGroup;
    saveRole() {
        const formValue = this.roleForm.value;
        debugger;
    }
    buildRoleFormGroup() {
        this.roleForm = this.fb.group({
            title: ['', Validators.required],
            entity: [''],
            description: [''],
            permissiongroups: this.fb.array([]),
        });
    }
    //Helper method, which returns the employees FormArray from the model empForm
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

    permissions(permIndex: number): FormArray {
        return this.permissiongroups()
            .at(permIndex)
            .get('permissions') as FormArray;
    }
    newPermission(permission: Permission): FormGroup {
        return this.fb.group({
            permissionid: permission.permissionid,
            permissiontitle: permission.permissiontitle,
            permissionvalue: false,
        });
    }
    addPermission(permIndex: number, permission: Permission) {
        this.permissions(permIndex).push(this.newPermission(permission));
    }
    permission_control(groupIndex: number, permIndex: number): any {
        const permissionarray = this.permissiongroups()
            .at(groupIndex)
            .get('permissions') as FormArray;
        return permissionarray.at(permIndex);
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
    //#endregion

    constructor(
        private entityProvider: EntityService,
        private roleProvider: RoleService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {
        this.buildRoleFormGroup();
    }
    async ngOnInit(): Promise<void> {
        this.breadcrumbItems = [
            { label: 'Administration' },
            { label: 'Roles', routerLink: '/administration/roles' },
            { label: 'Manage Role' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/' };
        await this.getEntityTree();
        await this.getPermissions();
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
                        this.selectedNodes = this.nodes.filter(
                            (f) => f.key == this.role.entityId
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
}
