import { Component, OnInit, signal } from '@angular/core';
import { UserDTO } from '../../../models/user/user';
import { User } from '../../../services/user';
import { SearchUserDTO } from '../../../models/user/search-user';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { isActive } from '@angular/router';
import { TableColumn } from '../../../models/table-column';
import { DataTable } from '../../shared/data-table/data-table';
import { FormInput } from '../../shared/form-input/form-input';

@Component({
  selector: 'app-user-management',
  imports: [ReactiveFormsModule, DataTable, FormInput],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  users = signal<UserDTO[] | null>(null);
  errorMessage = signal<string | null>(null);
  searchForm: FormGroup;
  columns: TableColumn<UserDTO>[] = [
    { header: 'First name', field: 'firstName' },
    { header: 'Last name', field: 'lastName' },
    { header: 'Email', field: 'email' },
    { header: 'Role', field: 'role' },
    { header: 'Status', field: 'isActive' },
  ];

  constructor(
    private userService: User,
    private fb: FormBuilder,
  ) {
    this.searchForm = fb.group({
      userEmail: [''],
      isActive: [null],
      roleId: [null],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  search() {
    const request: SearchUserDTO = {
      pageNumber: 1,
      pageSize: 20,
      email: this.searchForm.value.userEmail || undefined,
      isActive: this.searchForm.value.isActive,
      roleId: this.searchForm.value.roleId,
    };

    console.log(request);

    this.userService.searchUsers(request).subscribe({
      next: (response) => {
        this.users.set(response.items);
      },
      error: (err) => {
        this.errorMessage.set(err.error);
        console.log(err.error);
      },
    });
  }

  loadUsers() {
    const request: SearchUserDTO = {
      pageNumber: 1,
      pageSize: 20,
    };

    this.userService.searchUsers(request).subscribe({
      next: (response) => {
        this.users.set(response.items);
        console.log(response.items);
      },
      error: (err) => {
        this.errorMessage.set(err);
        console.log(err.error);
      },
    });
  }

  public activity(user: UserDTO): string {
    if (user.isActive == true) return 'Acive';
    else return 'Inactive';
  }

  get userEmail() {
    return this.searchForm.get('userEmail') as FormControl;
  }
}
