import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchAuditLogDTO } from '../../../models/auditLog/search-audit-log';
import { AuditLogDTO } from '../../../models/auditLog/audit-log';
import { TableColumn } from '../../../models/table-column';
import { DataTable } from "../../shared/data-table/data-table";
import { FormInput } from "../../shared/form-input/form-input";
import { Audit } from '../../../services/audit';

@Component({
  selector: 'app-audit-log',
  imports: [ReactiveFormsModule, DataTable, FormInput],
  templateUrl: './audit-log.html',
  styleUrl: './audit-log.css',
})
export class AuditLog implements OnInit {
  auditLogs = signal<AuditLogDTO[] | null>(null);
  searchForm: FormGroup;
  currentPage = signal(1);
  pageSize = 10;
  totalPages = signal(1);
  columns:TableColumn<AuditLogDTO>[] = [
    {header:'Name',field:'auditLogName'},
    {header:'Date and time',field:'dateAndTime'},
    {header:'User',field:'user'},
    {header:'Description',field:'description'},
  ]

  constructor(
    private auditService: Audit,
    private fb: FormBuilder,
  ) {
    this.searchForm = fb.group({
      auditLogName: [''],
      dateFrom: [''],
      dateTo: [''],
      userEmail: [''],
    });
  }

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  private loadAuditLogs(): void {
    const formValue = this.searchForm.value;

    const request: SearchAuditLogDTO = {
      pageNumber: this.currentPage(),
      pageSize: this.pageSize,
      auditLogName: formValue.auditLogName || undefined,
      dateFrom: formValue.dateFrom || undefined,
      dateTo: formValue.dateTo || undefined,
      userEmail: formValue.userEmail || undefined,
    };

    this.auditService.searchAudtiLog(request).subscribe({
      next: (response) => {
        this.auditLogs.set(response.items);
        this.totalPages.set(response.totalPage);
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  onSubmit() {
    this.currentPage.set(1);
    this.loadAuditLogs();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage.set(page);
    this.loadAuditLogs();
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  get userEmail(){
    return this.searchForm.get('userEmail') as FormControl;
  }

  get auditLogName(){
    return this.searchForm.get('auditLogName') as FormControl;
  }
}
