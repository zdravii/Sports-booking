import { PaginationRequest } from '../pagination-request';

export interface SearchReservationDTO extends PaginationRequest {
  userId?: number;
  date?: string;
  status?: number;
  courtId?: number;
  centerId?: number;
}
