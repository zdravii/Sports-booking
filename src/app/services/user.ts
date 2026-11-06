import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchUserDTO } from '../models/user/search-user';
import { Observable } from 'rxjs';
import { PaginationResponseDTO } from '../models/pagination-response';
import { UserDTO } from '../models/user/user';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class User {
  constructor(private http: HttpClient) {}

  searchUsers(request: SearchUserDTO): Observable<PaginationResponseDTO<UserDTO>> {
    let params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize);

    if (request.email) {
      params = params.set('email', request.email);
    }
    
    if (request.isActive !== null && request.isActive !== undefined) {
      params = params.set('isActive', request.isActive);
    }
    if (request.roleId) {
      params = params.set('roleId', request.roleId);
    }

    return this.http.get<PaginationResponseDTO<UserDTO>>(`${environment.apiUrl}/users`, { params });
  }
}
