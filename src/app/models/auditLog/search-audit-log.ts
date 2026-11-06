import { PaginationRequest } from "../pagination-request";

export interface SearchAuditLogDTO extends PaginationRequest {
  userEmail?: string;
  auditLogName?: string;
  dateFrom?: string;
  dateTo?: string;
}
