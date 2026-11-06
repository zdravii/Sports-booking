import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponseDTO } from '../models/pagination-response';
import { CourtDTO } from '../models/court/court';
import { SearchCourtDTO } from '../models/court/search-court';
import { environment } from '../../environments/environment.development';
import { CreateCourtDTO } from '../models/court/create-court';
import { EditCourtDTO } from '../models/court/edit-court';

@Injectable({
  providedIn: 'root',
})
export class Court {
  constructor(private http: HttpClient) {}

  searchCourts(request: SearchCourtDTO): Observable<PaginationResponseDTO<CourtDTO>> {
    let params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize);

    if (request.centerId) {
      params = params.set('centerId', request.centerId);
    }

    if (request.label) {
      params = params.set('label', request.label);
    }

    if (request.sportId) {
      params = params.set('sportId', request.sportId);
    }

    return this.http.get<PaginationResponseDTO<CourtDTO>>(
      `${environment.apiUrl}/centers/${request.centerId}/courts`,
      { params },
    );
  }

  getAllCourts(request: SearchCourtDTO): Observable<PaginationResponseDTO<CourtDTO>> {
    let params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize);

    return this.http.get<PaginationResponseDTO<CourtDTO>>(`${environment.apiUrl}/courts`, {
      params,
    });
  }

  getOneCourt(id: number): Observable<CourtDTO> {
    return this.http.get<CourtDTO>(`${environment.apiUrl}/courts/${id}`);
  }

  createCourt(request: CreateCourtDTO): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/courts`, request);
  }

  deleteCourt(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/courts/${id}`);
  }

  updateCourt(request: EditCourtDTO): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/courts`, request);
  }
}
