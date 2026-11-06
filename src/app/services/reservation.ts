import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchReservationDTO } from '../models/reservation/search-reservation';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { PaginationResponseDTO } from '../models/pagination-response';
import { ReservationDTO } from '../models/reservation/reservation';
import { CreateReservationDTO } from '../models/reservation/create-reservation';
import { PaginationRequest } from '../models/pagination-request';

@Injectable({
  providedIn: 'root',
})
export class Reservation {
  constructor(private http: HttpClient) {}

  searchReservation(
    request: SearchReservationDTO,
  ): Observable<PaginationResponseDTO<ReservationDTO>> {
    let params = new HttpParams()
      .set('pageSize', request.pageSize)
      .set('pageNumber', request.pageNumber);

    if (request.centerId) {
      params = params.set('centerId', request.centerId);
    }
    if (request.courtId) {
      params = params.set('courtId', request.courtId);
    }
    if (request.date) {
      params = params.set('date', request.date);
    }
    if (request.status) {
      params = params.set('status', request.status);
    }

    return this.http.get<PaginationResponseDTO<ReservationDTO>>(
      `${environment.apiUrl}/reservations/search`,
      { params },
    );
  }

  createReservation(request: CreateReservationDTO): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/reservations`, request);
  }

  getCurrentUserReservations(
    request: PaginationRequest,
  ): Observable<PaginationResponseDTO<ReservationDTO>> {
    let params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize);
    return this.http.get<PaginationResponseDTO<ReservationDTO>>(
      `${environment.apiUrl}/reservations`,
      { params },
    );
  }
}
