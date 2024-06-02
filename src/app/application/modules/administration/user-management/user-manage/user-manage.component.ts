import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { EntityService } from '../../entity-management/entity.service';
import { RoleService } from '../../role-management/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageResponse } from 'src/app/application/common/shared-models/shared.model';
import { HttpStatusCode } from '@angular/common/http';
import { UserEntity, UserList } from '../user.model';
import { UserService } from '../user.service';
import { GlobalTreeSearch } from 'src/app/application/common/app-util';
import { lastValueFrom } from 'rxjs';
import { AuthService, User } from 'src/app/application/core/authentication';

@Component({
    selector: 'app-manage-role',
    templateUrl: './user-manage.component.html',
})
export class ManageUserComponent implements OnInit {
    //#region Variables
    loggedInUser!: User;
    inProgress: boolean = false;
    loggedInUserId: number = 0;
    breadcrumbItems: MenuItem[] = [];
    home: MenuItem | undefined;
    nodes!: any[];
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
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private auth: AuthService
    ) {
        this.buildUserFormGroup();
    }
    async ngOnInit(): Promise<void> {
        this.loggedInUser = this.auth.getUser();
        this.loggedInUserId = this.loggedInUser.id;
        this.inProgress = true;
        const $this = this;
        await this.checkUserDetails($this);
        this.pageSetting();
        await this.getEntityTree($this);
        if (this.user.id > 0) {
            await this.loadRoles($this);
        }
        this.inProgress = false;
    }
    //#endregion
    //#region page settings
    pageSetting() {
        this.breadcrumbItems = [
            { label: 'Administration' },
            { label: 'User(s)', routerLink: '/ais-suite/administration/users' },
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
    async checkUserDetails(this_object: any) {
        let $this = this;
        if (this_object) {
            $this = this_object;
        }
        $this.activatedRoute.params.subscribe(
            (params: any) => ($this.user.id = params.id)
        );
        if ($this.user.id && $this.user.id > 0) {
            //retrieve role details first
            const userDetailReq = $this.userProvider.getUserById({
                id: $this.user.id,
            });
            const response = (await lastValueFrom(
                userDetailReq
            )) as MessageResponse;
            if (response.statusCode === HttpStatusCode.Ok) {
                $this.user = {} as UserEntity;
                $this.user = response.result.user as UserEntity;
                $this.userForm.patchValue({
                    email: $this.user.email,
                    firstname: $this.user.firstname,
                    middlename: $this.user.middlename,
                    lastname: $this.user.lastname,
                    active: $this.user.active,
                    description: $this.user.description,
                    entity: null,
                    roles: [],
                });
            } else {
                $this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: response.errorMessage,
                    life: 3000,
                });
            }
        }
    }
    async getEntityTree(this_object: any) {
        let $this = this;
        if (this_object) {
            $this = this_object;
        }
        const entityReq = $this.entityProvider.getEntityTree({ id: 0 });
        const response = (await lastValueFrom(entityReq)) as MessageResponse;

        if (response.statusCode === HttpStatusCode.Ok) {
            this.nodes = response.result;
            if (
                $this.user.id > 0 &&
                $this.user.entityId &&
                $this.user.entityId > 0
            ) {
                const selectedEntity = GlobalTreeSearch(
                    this.nodes,
                    this.user.entityId
                );
                if (selectedEntity) {
                    $this.userForm.patchValue({ entity: selectedEntity });
                }
            }
        } else {
            $this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.errorMessage,
                life: 3000,
            });
        }
    }
    roles: any[] = [];
    async loadRoles(this_object: any) {
        let $this = this;
        if (this_object) {
            $this = this_object;
        }
        const formValue = $this.userForm.value;
        const entityId = formValue.entity.key;
        const roleReq = $this.roleProvider.getAllRolesByEntity({
            id: entityId,
        });
        const response = (await lastValueFrom(roleReq)) as MessageResponse;
        if (response.statusCode === HttpStatusCode.Ok) {
            $this.roles = response.result;
            if (
                $this.user.id > 0 &&
                $this.user.roles &&
                $this.user.roles.length > 0
            ) {
                let selectedRoles = [];
                for (let i = 0; i < $this.user.roles.length; i++) {
                    const roleIndex = $this.roles.findIndex(
                        (s) => s.id == $this.user.roles[i]
                    );
                    if (roleIndex > -1) {
                        selectedRoles.push($this.roles[roleIndex]);
                    }
                }
                $this.userForm.patchValue({
                    roles: selectedRoles,
                });
            }
        } else {
            $this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.errorMessage,
                life: 3000,
            });
        }
    }
    async saveUser() {
        this.submitted = true;
        if (this.userForm.valid) {
            const formValue = this.userForm.value;
            const userRequest = {} as UserEntity;
            if (this.user.id > 0) {
                userRequest.id = this.user.id;
            }
            userRequest.active = formValue.active == '' ? false : formValue.active;
            userRequest.email = formValue.email;
            userRequest.firstname = formValue.firstname;
            userRequest.lastname = formValue.lastname;
            userRequest.middlename = formValue.middlename;
            userRequest.entityId = formValue.entity.key;
            userRequest.description = formValue.description;
            userRequest.createdBy = this.loggedInUserId;
            let selectedRoles = [] as number[];
            if (formValue.roles && Array.isArray(formValue.roles)) {
                for (let i = 0; i < formValue.roles.length; i++) {
                    selectedRoles.push(formValue.roles[i].id);
                }
            }
            userRequest.roles = selectedRoles;
            const manageUserReq = this.userProvider
                .saveUser(userRequest)
                .subscribe((response: MessageResponse) => {
                    this.inProgress = false;
                    this.submitted = false;
                    if (response.statusCode === HttpStatusCode.Ok) {
                        if (
                            userRequest.id < 1 ||
                            userRequest.id == undefined ||
                            userRequest.id == null
                        ) {
                            this.userForm.reset();
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'User Saved Successfully.',
                            life: 3000,
                        });
                        //TODO: Make readable form
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: response.errorMessage,
                            life: 3000,
                        });
                    }
                });
            // const response = (await lastValueFrom(manageUserReq)) as MessageResponse;
            // if (response.statusCode === HttpStatusCode.Ok) {

            // }
            // else {
            //     this.messageService.add({
            //         severity: 'error',
            //         summary: 'Error',
            //         detail: response.errorMessage,
            //         life: 3000,
            //     });
            // }
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill the form correctly.',
                life: 3000,
            });
        }
    }
    cancel() {
        this.router.navigateByUrl('/ais-suite/administration/users');
    }
    //#endregion
}
