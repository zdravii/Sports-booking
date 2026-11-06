import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchSportDTO } from '../models/sport/search-sport';
import { Observable } from 'rxjs';
import { PaginationResponseDTO } from '../models/pagination-response';
import { SportDTO } from '../models/sport/sport';
import { environment } from '../../environments/environment.development';
import { CreateSportDTO } from '../models/sport/create-sport';
import { EditSportDTO } from '../models/sport/edit-sport';

@Injectable({
  providedIn: 'root',
})
export class Sport {
  constructor(private http: HttpClient) {}

  searchSports(request: SearchSportDTO): Observable<PaginationResponseDTO<SportDTO>> {
    let params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize);

    if (request.centerId) {
      params = params.set('centerId', request.centerId);
    }

    return this.http.get<PaginationResponseDTO<SportDTO>>(
      `${environment.apiUrl}/sports/by-center/${request.centerId}`,
      { params },
    );
  }

  getOneSport(id: number): Observable<SportDTO> {
    return this.http.get<SportDTO>(`${environment.apiUrl}/sports/${id}`);
  }

  getAllSports(request: SearchSportDTO): Observable<PaginationResponseDTO<SportDTO>> {
    let params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize);

    return this.http.get<PaginationResponseDTO<SportDTO>>(`${environment.apiUrl}/sports`, {
      params,
    });
  }

  createSport(request: CreateSportDTO): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/sports`, request);
  }

  updateSport(request: EditSportDTO): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/sports`, request);
  }

  deleteSport(id:number):Observable<void>{
    return this.http.delete<void>(`${environment.apiUrl}/sports/${id}`);
  }
}
