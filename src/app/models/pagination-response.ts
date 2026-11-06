export interface PaginationResponseDTO<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
}
