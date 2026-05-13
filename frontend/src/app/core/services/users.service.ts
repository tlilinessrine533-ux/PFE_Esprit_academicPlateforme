import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateUserPayload, UpdateUserPayload, UserResponse } from '../models/auth.models';
import { Department } from '../models/shared.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  getUsers() {
    return this.http.get<UserResponse[]>('/api/users');
  }

  getDepartments() {
    return this.http.get<Department[]>('/api/departments');
  }

  createUser(payload: CreateUserPayload) {
    return this.http.post<UserResponse>('/api/users', payload);
  }

  updateUser(id: number, payload: UpdateUserPayload) {
    return this.http.put<UserResponse>(`/api/users/${id}`, payload);
  }

  deleteUser(id: number) {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}
