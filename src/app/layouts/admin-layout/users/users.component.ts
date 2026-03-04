import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { UserService } from '../services/user.service';
import { UserForm } from "./user-form/user-form.component";
import { NgClass } from '@angular/common';
import { AlertService } from '../../main-layout/services/alert.service';


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
      userId: [0, [Validators.required, Validators.min(1)]]
    }
    // Validators.pattern(/^\d{8}$/)
  );



  editing = false;
  userEdit: User | null = null;
  user : User | null = null;
  users: User[] | null = null;


  ngOnInit()
  {
    this.loadUsers();
  }


  get f()
  {
    return this.userForm.controls;
  }

  clear()
  {
    this.user = null;
    this.userForm.reset();
  }

  loadUsers()
  {
    this.userService.getUsers().subscribe(
      {
        next: res=> {
          this.users = res.data
        }
      }
    )
  }

  loadUser()
  {
    if(this.userForm.invalid){
      this.userForm.markAllAsTouched();
      return;
    }

    const userId = this.userForm.getRawValue().userId;

    this.userService.getUser(userId).subscribe(
      {
        next: res=>this.user = res.data
      }
    )
  }

  lockUser(user: User)
  {
    this.userService.lockUser(user.nip).subscribe({
      next: res=> {
        this.alertService.success('Usuario bloqueado');
        this.loadUsers();
        this.alertService.clear(2000);
      },
      error: err=> {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      }
    });
  }

  unLockUser(user: User)
  {
   this.userService.unLockUser(user.nip).subscribe({
      next: res=> {
        this.alertService.success('Usuario desbloqueado');
        this.loadUsers();
        this.alertService.clear(2000);
      },
      error: err=> {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      }
    });
  }

  showModal(user: User)
  {
    this.userEdit = user;
    this.editing = true;
  }
}
