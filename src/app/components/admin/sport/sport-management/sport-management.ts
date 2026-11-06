import { Component, OnInit, signal } from '@angular/core';
import { SportDTO } from '../../../../models/sport/sport';
import { Sport } from '../../../../services/sport';
import { SearchSportDTO } from '../../../../models/sport/search-sport';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CenterDTO } from '../../../../models/center/center';
import { Center } from '../../../../services/center';
import { TableColumn } from '../../../../models/table-column';
import { DataTable } from '../../../shared/data-table/data-table';
import { SelectOption } from '../../../../models/select-option';
import { FromSelect } from '../../../shared/from-select/from-select';

@Component({
  selector: 'app-sport-management',
  imports: [RouterLink, ReactiveFormsModule, DataTable, FromSelect],
  templateUrl: './sport-management.html',
  styleUrl: './sport-management.css',
})
export class SportManagement implements OnInit {
  sports = signal<SportDTO[] | null>(null);
  errorMessage = signal<string | null>(null);
  centers = signal<CenterDTO[] | null>(null);
  centerOptions = signal<SelectOption[]>([]);
  searchForm: FormGroup;
  columns: TableColumn<SportDTO>[] = [
    { header: 'Sport', field: 'name' },
    { header: 'Description', field: 'description' },
  ];

  constructor(
    private sportService: Sport,
    private fb: FormBuilder,
    private centerService: Center,
    private router: Router,
  ) {
    this.searchForm = fb.group({
      centerId: [0, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadSports();
    this.loadCenters();
  }

  search() {
    const request: SearchSportDTO = {
      pageNumber: 1,
      pageSize: 10,
      centerId: Number(this.searchForm.value.centerId) ?? undefined,
    };
    this.sportService.searchSports(request).subscribe({
      next: (response) => {
        this.sports.set(response.items);
      },
    });
  }

  onDeleteSport(sport: SportDTO): void {
    if (sport.id <= 0) {
      this.errorMessage.set('Invalid parameter');
      return;
    }

    this.sportService.deleteSport(sport.id).subscribe({
      next: () => {
        this.errorMessage.set(null);
        this.loadSports();
      },
      error: (err) => {
        this.errorMessage.set(err.error);
      },
    });
  }

  onEditSport(sport: SportDTO): void {
    this.router.navigate(['/admin/sports/edit', sport.id]);
  }

  private loadSports(): void {
    const request: SearchSportDTO = {
      pageNumber: 1,
      pageSize: 20,
    };

    this.sportService.getAllSports(request).subscribe({
      next: (response) => {
        this.sports.set(response.items);
        this.errorMessage.set(null);
      },
      error: (err) => {
        this.errorMessage.set(err);
        console.log(this.errorMessage);
      },
    });
  }

  private loadCenters() {
    this.centerService.getCenters().subscribe({
      next: (response) => {
        this.centers.set(response.items);
        this.centerOptions.set(response.items.map((c) => ({ value: c.id, label: c.name })));
      },
    });
  }

  get centerId() {
    return this.searchForm.get('centerId') as FormControl;
  }
}
