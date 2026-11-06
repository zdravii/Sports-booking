import { Component, OnInit, signal } from '@angular/core';
import { CenterDTO } from '../../../../models/center/center';
import { SportDTO } from '../../../../models/sport/sport';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Center } from '../../../../services/center';
import { Sport } from '../../../../services/sport';
import { Court } from '../../../../services/court';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchSportDTO } from '../../../../models/sport/search-sport';
import { CreateCourtDTO } from '../../../../models/court/create-court';
import { EditCenterDTO } from '../../../../models/center/edit-center';
import { EditCourtDTO } from '../../../../models/court/edit-court';
import { FormInput } from '../../../shared/form-input/form-input';
import { FromSelect } from '../../../shared/from-select/from-select';
import { SelectOption } from '../../../../models/select-option';

@Component({
  selector: 'app-court-edit',
  imports: [ReactiveFormsModule, FormInput, FromSelect],
  templateUrl: './court-edit.html',
  styleUrl: './court-edit.css',
})
export class CourtEdit implements OnInit {
  centers = signal<CenterDTO[] | null>(null);
  sports = signal<SportDTO[] | null>(null);
  sportOptions = signal<SelectOption[]>([]);
  centerOptions = signal<SelectOption[]>([]);
  eidtForm: FormGroup;

  constructor(
    private centerService: Center,
    private sportService: Sport,
    private courtService: Court,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.eidtForm = fb.group({
      label: ['', [Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      sportId: [0, Validators.min(1)],
      centerId: [0, Validators.min(1)],
    });
  }

  ngOnInit(): void {
    this.loadSports();
    this.loadCenters();

    this.bindForm();
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

  bindForm() {
    let courtId = Number(this.route.snapshot.paramMap.get('id'));

    this.courtService.getOneCourt(courtId).subscribe({
      next: (court) => {
        this.eidtForm.patchValue({
          label: court.label,
          sportId: court.sportId,
          centerId: court.centerId,
        });
      },
    });
  }

  onSubmit() {
    let courtId = Number(this.route.snapshot.paramMap.get('id'));
    const request: EditCourtDTO = {
      courtId: courtId,
      label: this.eidtForm.value.label,
      sportId: this.eidtForm.value.sportId,
      centerId: this.eidtForm.value.centerId,
    };

    this.courtService.updateCourt(request).subscribe({
      next: () => {
        this.router.navigate(['/admin/courts']);
      },
    });
  }

  get label() {
    return this.eidtForm.get('label') as FormControl;
  }

  get centerId() {
    return this.eidtForm.get('centerId') as FormControl;
  }

  get sportId() {
    return this.eidtForm.get('sportId') as FormControl;
  }
}
