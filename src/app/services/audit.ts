import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchAuditLogDTO } from '../models/auditLog/search-audit-log';
import { Observable } from 'rxjs';
import { PaginationResponseDTO } from '../models/pagination-response';
import { AuditLogDTO } from '../models/auditLog/audit-log';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Audit {
  constructor(private http: HttpClient) {}

  searchAudtiLog(request: SearchAuditLogDTO): Observable<PaginationResponseDTO<AuditLogDTO>> {
    let params = new HttpParams()
      .set('pageNumber', request.pageNumber)
      .set('pageSize', request.pageSize);

    if (request.dateFrom) {
      params = params.set('dateFrom', request.dateFrom);
    }
    if (request.dateTo) {
      params = params.set('dateTo', request.dateTo);
    }

    if (request.auditLogName) {
      params = params.set('auditLogName', request.auditLogName);
    }

    if (request.userEmail) {
      params = params.set('userEmail', request.userEmail);
    }

    return this.http.get<PaginationResponseDTO<AuditLogDTO>>(`${environment.apiUrl}/AuditLog`, {
      params,
    });
  }
}
