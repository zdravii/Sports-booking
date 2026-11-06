import { PaginationRequest } from "../pagination-request";

export interface SearchUserDTO extends PaginationRequest {
  email?: string;
  roleId?: number;
  isActive?: boolean;
}
