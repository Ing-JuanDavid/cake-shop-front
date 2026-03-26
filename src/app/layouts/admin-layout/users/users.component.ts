import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { UserForm } from './user-form/user-form.component';
import { NgClass } from '@angular/common';
import { AlertService } from '../../../core/services/alert.service';
import { PaginatedResponse } from '../../../core/dtos/responses/paginatedProduct.response';
import { UserFilters } from '../../../core/dtos/requests/userFilters.request';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-users-view',
  imports: [ReactiveFormsModule, UserForm, NgClass],
  templateUrl: './users.html',
  styles: ``,
})
export class Users {
  fb = inject(FormBuilder);
  userService = inject(UserService);
  alertService = inject(AlertService);
  userForm = this.fb.nonNullable.group(
    {
      userId: [0, [Validators.required, Validators.min(1)]],
    },
    // Validators.pattern(/^\d{8}$/)
  );

  // Drawner
  drawerOpen = false;
  drawerAnimated = false;


  editing = false;
  userEdit: User | null = null;
  user: User | null = null;

  currentPage = 1;
  sizePage = 5;
  filters: UserFilters = {};

  page: PaginatedResponse<User> = {
    currentPage: 1,
    pageLength: 5,
    nextPage: 1,
    data: [],
    totalElements: 0,
    totalPages: 1,
  };

  @ViewChild('nameFilter') nameFilter!: ElementRef;
  @ViewChild('emailFilter') emailFilter!: ElementRef;
  @ViewChild('nipFilter') nipFilter!: ElementRef;
  @ViewChild('rolFilter') rolFilter!: ElementRef;
  @ViewChild('isAccountNonLocked') isAccountNonLocked!: ElementRef;

  constructor(private router: Router){}

  ngOnInit() {
    this.loadUsers();
  }

  get f() {
    return this.userForm.controls;
  }

  clear() {
    this.user = null;
    this.userForm.reset();
  }

  loadUsers() {
    this.userService.getUsers(this.currentPage, this.sizePage, this.filters).subscribe({
      next: (res) => {
        res.data.data.map( u => {
          if(u.roles[0] != '') {
            u.roles = (u.roles[0].includes('USER')) ? ['user'] : ['admin'];
          }
        });

        this.page = res.data;
      },
    });
  }


  lockUser(user: User) {
    this.userService.lockUser(user.nip).subscribe({
      next: (res) => {
        this.alertService.success('Usuario bloqueado');
        this.loadUsers();
        this.alertService.clear(2000);
      },
      error: (err) => {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      },
    });
  }

  unLockUser(user: User) {
    this.userService.unLockUser(user.nip).subscribe({
      next: (res) => {
        this.alertService.success('Usuario desbloqueado');
        this.loadUsers();
        this.alertService.clear(2000);
      },
      error: (err) => {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      },
    });
  }

  showModal(user: User) {
    this.userEdit = user;
    this.editing = true;
  }

  editUser(user: User)
  {
    this.userEdit = user;
    this.editing = true;
    this.openDrawer();
  }

  createuser()
  {
    this.userEdit = null;
    this.editing = false;
    this.openDrawer();
  }

  changePage(currentPage: number) {
    this.currentPage = currentPage;
    this.loadUsers();
  }

  applyFilters(filters: UserFilters) {
    this.filters = filters;
    this.currentPage = 1; // reset to first page when filtering
    this.loadUsers();
  }

  cleanFilters() {
    this.applyFilters({});
    this.nameFilter.nativeElement.value = '';
    this.emailFilter.nativeElement.value = '';
    this.nipFilter.nativeElement.value = '';
    this.rolFilter.nativeElement.value = '';
    this.isAccountNonLocked.nativeElement.value = '';
  }

  parseAccountFilter(value: string) {
    if (value === '') return undefined;

    return value === 'true';
  }

  openDrawer() {
    this.drawerOpen = true;
    this.drawerAnimated = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  goToUserDetails(nip: string)
  {
    this.router.navigate([`admin/users/${nip}`]);
  }
}
