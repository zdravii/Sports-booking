import { PaginationRequest } from "../pagination-request";

export interface SearchSportDTO extends PaginationRequest {
  centerId?: number;
}
