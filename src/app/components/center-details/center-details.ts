import { Component, OnInit, signal } from '@angular/core';
import { CenterDTO } from '../../models/center/center';
import { CourtDTO } from '../../models/court/court';
import { ActivatedRoute } from '@angular/router';
import { Center } from '../../services/center';
import { Court } from '../../services/court';
import { SearchCourtDTO } from '../../models/court/search-court';
import { Sport } from '../../services/sport';
import { SportDTO } from '../../models/sport/sport';
import { SearchSportDTO } from '../../models/sport/search-sport';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CourtCard } from '../shared/court-card/court-card';
import { SelectOption } from '../../models/select-option';
import { FromSelect } from '../shared/from-select/from-select';
import { FormInput } from '../shared/form-input/form-input';

@Component({
  selector: 'app-center-details',
  imports: [ReactiveFormsModule, CourtCard, FromSelect, FormInput],
  templateUrl: './center-details.html',
  styleUrl: './center-details.css',
})
export class CenterDetails implements OnInit {
  center = signal<CenterDTO | null>(null);
  courts = signal<CourtDTO[]>([]);
  sportOptions = signal<SelectOption[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  sports = signal<SportDTO[]>([]);

  searchForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private centerSerivice: Center,
    private courtService: Court,
    private sportService: Sport,
    private fb: FormBuilder,
  ) {
    this.searchForm = fb.group({
      label: [''],
      sportId: 0,
    });
  }

  ngOnInit(): void {
    this.loadSposts();
    this.loadCourts();
  }

  onSubmit(): void {
    this.loadCourts();
  }

  private loadCourts() {
    const centerId = Number(this.route.snapshot.paramMap.get('id'));
    this.centerSerivice.getCenterDetails(centerId).subscribe({
      next: (center) => {
        this.center.set(center);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load center details');
      },
    });

    const courtsSearchRequest: SearchCourtDTO = {
      centerId: centerId,
      pageNumber: 1,
      pageSize: 20,
      sportId: this.searchForm.value.sportId || undefined,
      label: this.searchForm.value.label || undefined,
    };

    this.courtService.searchCourts(courtsSearchRequest).subscribe({
      next: (result) => {
        this.courts.set(result.items);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load courts');
        this.isLoading.set(false);
      },
    });
  }

  private loadSposts() {
    const centerId = Number(this.route.snapshot.paramMap.get('id'));
    const sportsSearchRequest: SearchSportDTO = {
      centerId: centerId,
      pageNumber: 1,
      pageSize: 20,
    };

    this.sportService.searchSports(sportsSearchRequest).subscribe({
      next: (result) => {
        this.sports.set(result.items);
        this.sportOptions.set(result.items.map((s) => ({ value: s.id, label: s.name })));
      },
      error: (err) => {
        this.errorMessage.set('Failed to load sports');
      },
    });
  }

  get label() {
    return this.searchForm.get('label') as FormControl;
  }

  get sportId() {
    return this.searchForm.get('sportId') as FormControl;
  }
}
