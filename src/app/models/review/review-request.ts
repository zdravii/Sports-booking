import { PaginationRequest } from "../pagination-request";

export interface ReviewRequestDTO extends PaginationRequest {
  courtId: number;
}
