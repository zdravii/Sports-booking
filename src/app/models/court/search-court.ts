import { PaginationRequest } from "../pagination-request";

export interface SearchCourtDTO extends PaginationRequest {
  centerId?: number;
  label?: string;
  sportId?: number;
}
