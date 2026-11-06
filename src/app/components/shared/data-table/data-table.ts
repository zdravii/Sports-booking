import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from '../../../models/table-column';

@Component({
  selector: 'app-data-table',
  imports: [DatePipe],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable<T extends {id:number}> {
  @Input({required:true}) columns!:TableColumn<T>[];
  @Input({required:true}) data!:T[];
  @Input() showActions = false;

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  onEdit(item:T):void{
    this.edit.emit(item);
  }

  onDelete(item:T):void{
    this.delete.emit(item);
  }
}
