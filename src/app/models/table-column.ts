export interface TableColumn<T> {
  header: string;
  field: keyof T;
  type?: 'text' | 'date' | 'badge';
}
