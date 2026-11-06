import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CenterDTO } from '../models/center/center';
import { PaginationResponseDTO } from '../models/pagination-response';
import { environment } from '../../environments/environment.development';
import { SearchCentersDTO } from '../models/center/search-centers';
import { CreateCenterDTO } from '../models/center/create-center';
import { EditCenterDTO } from '../models/center/edit-center';
import { ToggleCenterSportsDTO } from '../models/center/toggle-center-sports';

@Injectable({
  providedIn: 'root',
})
export class Center {
  constructor(private http: HttpClient) {}

  getCenters(): Observable<PaginationResponseDTO<CenterDTO>> {
    return this.http.get<PaginationResponseDTO<CenterDTO>>(`${environment.apiUrl}/centers`);
  }

  getCenterDetails(id: number): Observable<CenterDTO> {
    return this.http.get<CenterDTO>(`${environment.apiUrl}/centers/${id}`);
  }

  searchCenters(request: SearchCentersDTO): Observable<PaginationResponseDTO<CenterDTO>> {
    let params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize);

    if (request.name) {
      params = params.set('name', request.name);
    }

    return this.http.get<PaginationResponseDTO<CenterDTO>>(`${environment.apiUrl}/centers`, {
      params,
    });
  }

  createCenter(request: CreateCenterDTO): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/centers`, request);
  }

  deleteCenter(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/centers/${id}`);
  }

  updateCenter(request:EditCenterDTO):Observable<void>{
    return this.http.put<void>(`${environment.apiUrl}/centers`,request);
  }

  toggleCenterSports(request:ToggleCenterSportsDTO):Observable<void>{
    return this.http.put<void>(`${environment.apiUrl}/centers/${request.centerId}/sports`,request.sportIds)
  }
}
