import { PaginationRequest } from '../pagination-request';

export interface SearchCentersDTO extends PaginationRequest {
  name?: string;
}
