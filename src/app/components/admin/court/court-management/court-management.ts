import { Component, OnInit, signal } from '@angular/core';
import { CourtDTO } from '../../../../models/court/court';
import { Court } from '../../../../services/court';
import { SearchCourtDTO } from '../../../../models/court/search-court';
import { Router, RouterLink } from '@angular/router';
import { SportDTO } from '../../../../models/sport/sport';
import { CenterDTO } from '../../../../models/center/center';
import { Sport } from '../../../../services/sport';
import { Center } from '../../../../services/center';
import { SearchSportDTO } from '../../../../models/sport/search-sport';
import { SearchCentersDTO } from '../../../../models/center/search-centers';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TableColumn } from '../../../../models/table-column';
import { DataTable } from '../../../shared/data-table/data-table';
import { FormInput } from '../../../shared/form-input/form-input';
import { SelectOption } from '../../../../models/select-option';
import { FromSelect } from "../../../shared/from-select/from-select";

@Component({
  selector: 'app-court-management',
  imports: [RouterLink, ReactiveFormsModule, DataTable, FormInput, FromSelect],
  templateUrl: './court-management.html',
  styleUrl: './court-management.css',
})
export class CourtManagement implements OnInit {
  courts = signal<CourtDTO[] | null>(null);
  errorMessage = signal<string | null>(null);
  sports = signal<SportDTO[] | null>(null);
  centers = signal<CenterDTO[] | null>(null);
  sportOptions = signal<SelectOption[]>([]);
  centerOptions = signal<SelectOption[]>([]);
  searchForm: FormGroup;
  columns: TableColumn<CourtDTO>[] = [
    { header: 'Court', field: 'label' },
    { header: 'Sport', field: 'sport' },
    { header: 'Center', field: 'center' },
    { header: 'Status', field: 'isActive' },
  ];

  constructor(
    private courtService: Court,
    private sportService: Sport,
    private centerService: Center,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.searchForm = fb.group({
      label: [''],
      centerId: [0],
      sportId: [0],
    });
  }

  ngOnInit(): void {
    this.loadCourts();
    this.loadCenters();
    this.loadSports();
  }

  search() {
    const request: SearchCourtDTO = {
      pageNumber: 1,
      pageSize: 20,
      centerId: this.searchForm.value.centerId ?? undefined,
      sportId: this.searchForm.value.sportId ?? undefined,
      label: this.searchForm.value.label ?? undefined,
    };

    this.courtService.searchCourts(request).subscribe({
      next: (response) => {
        this.courts.set(response.items);
      },
    });
  }

  onEditCourt(court: CourtDTO): void {
    this.router.navigate(['/admin/courts/edit', court.id]);
  }

  onDeleteCourt(court: CourtDTO) {
    this.courtService.deleteCourt(court.id).subscribe({
      next: () => {
        this.loadCourts();
      },
    });
  }

  public activity(court: CourtDTO): string {
    if (court.isActive == true) return 'Acive';
    else return 'Inactive';
  }

  private loadCourts() {
    const request: SearchCourtDTO = {
      pageNumber: 1,
      pageSize: 20,
    };

    this.courtService.getAllCourts(request).subscribe({
      next: (response) => {
        this.courts.set(response.items);
        console.log(response);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage.set(err);
      },
    });
  }

  private loadSports() {
    const request: SearchSportDTO = {
      pageNumber: 1,
      pageSize: 20,
    };
    this.sportService.getAllSports(request).subscribe({
      next: (response) => {
        this.sports.set(response.items);
        this.sportOptions.set(response.items.map((s) => ({ value: s.id, label: s.name })));
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

  get label() {
    return this.searchForm.get('label') as FormControl;
  }

  get centerId() {
    return this.searchForm.get('centerId') as FormControl;
  }

  get sportId() {
    return this.searchForm.get('sportId') as FormControl;
  }
}
