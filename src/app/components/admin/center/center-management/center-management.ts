import { Component, OnInit, signal } from '@angular/core';
import { CenterDTO } from '../../../../models/center/center';
import { Center } from '../../../../services/center';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchCentersDTO } from '../../../../models/center/search-centers';
import { TableColumn } from '../../../../models/table-column';
import { DataTable } from "../../../shared/data-table/data-table";
import { FormInput } from "../../../shared/form-input/form-input";

@Component({
  selector: 'app-center-management',
  imports: [RouterLink, ReactiveFormsModule, DataTable, FormInput],
  templateUrl: './center-management.html',
  styleUrl: './center-management.css',
})
export class CenterManagement implements OnInit {
  centers = signal<CenterDTO[] | null>(null);
  errorMessage = signal<string | null>(null);
  searchForm: FormGroup;
  columns: TableColumn<CenterDTO>[] = [
    { header: 'Name', field: 'name' },
    { header: 'Address', field: 'address' },
  ];

  constructor(
    private centerService: Center,
    private fb: FormBuilder,
    private router:Router
  ) {
    this.searchForm = fb.group({
      name: [''],
    });
  }

  ngOnInit(): void {
    this.loadCenters();
  }

  onSubmit() {
    const request: SearchCentersDTO = {
      name: this.searchForm.value.name,
      pageNumber: 1,
      pageSize: 20,
    };

    this.centerService.searchCenters(request).subscribe({
      next: (result) => {
        this.centers.set(result.items);
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  onEditCenter(center:CenterDTO):void{
    this.router.navigate(['/admin/centers/edit',center.id]);
  }

  private loadCenters() {
    this.centerService.getCenters().subscribe({
      next: (result) => {
        this.centers.set(result.items);
        this.errorMessage.set(null);
        console.log(this.centers);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage.set('Unable to load centers');
      },
    });
  }

  onDeleteCenter(center: CenterDTO) {
    if (center.id <= 0) {
      this.errorMessage.set('Invalid parameter');
      return;
    }

    this.centerService.deleteCenter(center.id).subscribe({
      next: () => {
        this.errorMessage.set(null);
        this.loadCenters();
      },
      error: (err) => {
        this.errorMessage.set(err.error);
      },
    });
  }

  get name(){
    return this.searchForm.get('name') as FormControl;
  }
}
