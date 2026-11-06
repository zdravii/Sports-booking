import { Component, OnInit, signal } from '@angular/core';
import { Center } from '../../../../services/center';
import { Sport } from '../../../../services/sport';
import { CenterDTO } from '../../../../models/center/center';
import { SportDTO } from '../../../../models/sport/sport';
import { SearchSportDTO } from '../../../../models/sport/search-sport';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CreateCourtDTO } from '../../../../models/court/create-court';
import { Court } from '../../../../services/court';
import { FormInput } from '../../../shared/form-input/form-input';
import { FromSelect } from '../../../shared/from-select/from-select';
import { SelectOption } from '../../../../models/select-option';

@Component({
  selector: 'app-court-create',
  imports: [ReactiveFormsModule, FormInput, FromSelect],
  templateUrl: './court-create.html',
  styleUrl: './court-create.css',
})
export class CourtCreate implements OnInit {
  centers = signal<CenterDTO[] | null>(null);
  sports = signal<SportDTO[] | null>(null);
  sportOptions = signal<SelectOption[]>([]);
  centerOptions = signal<SelectOption[]>([]);
  createForm: FormGroup;

  constructor(
    private centerService: Center,
    private sportService: Sport,
    private courtService: Court,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.createForm = fb.group({
      label: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      sportId: [0, [Validators.min(1)]],
      centerId: [0, [Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadSports();
    this.loadCenters();
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

  onSubmit() {
    const request: CreateCourtDTO = this.createForm.value;

    this.courtService.createCourt(request).subscribe({
      next: () => {
        this.router.navigate(['/admin/courts']);
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  get label() {
    return this.createForm.get('label') as FormControl;
  }

  get centerId() {
    return this.createForm.get('centerId') as FormControl;
  }

  get sportId() {
    return this.createForm.get('sportId') as FormControl;
  }
}
