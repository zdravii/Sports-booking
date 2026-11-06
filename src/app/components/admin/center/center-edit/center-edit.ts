import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Center } from '../../../../services/center';
import { ActivatedRoute, Router } from '@angular/router';
import { EditCenterDTO } from '../../../../models/center/edit-center';
import { SportDTO } from '../../../../models/sport/sport';
import { Sport } from '../../../../services/sport';
import { SearchSportDTO } from '../../../../models/sport/search-sport';
import { ToggleCenterSportsDTO } from '../../../../models/center/toggle-center-sports';
import { FormInput } from "../../../shared/form-input/form-input";

@Component({
  selector: 'app-center-edit',
  imports: [ReactiveFormsModule, FormInput],
  templateUrl: './center-edit.html',
  styleUrl: './center-edit.css',
})
export class CenterEdit implements OnInit {
  editForm: FormGroup;
  sports = signal<SportDTO[] | null>(null);
  alreadyCheckedIds = signal<number[]>([]);

  constructor(
    private fb: FormBuilder,
    private centerService: Center,
    private sportService: Sport,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required,Validators.minLength(4), Validators.maxLength(30)]],
      address: ['', [Validators.required,Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    let centerId = Number(this.route.snapshot.paramMap.get('id'));
    this.centerService.getCenterDetails(centerId).subscribe({
      next: (center) => {
        this.editForm.patchValue({
          name: center.name,
          address: center.address,
        });

        this.alreadyCheckedIds.set(center.sportIds.map(Number));
      },
      error: (err) => {
        console.log(err);
      },
    });

    const request: SearchSportDTO = {
      pageNumber: 1,
      pageSize: 20,
    };
    this.sportService.getAllSports(request).subscribe({
      next: (response) => {
        this.sports.set(response.items);
      },
    });
  }

  editCenter() {
    console.log('EDIT CENTER CLICKED');
    const centerId = Number(this.route.snapshot.paramMap.get('id'));

    const request: EditCenterDTO = {
      centerId: centerId,
      name: this.editForm.value.name,
      address: this.editForm.value.address,
    };

    const toggleSportsRequest: ToggleCenterSportsDTO = {
      centerId: centerId,
      sportIds: this.alreadyCheckedIds(),
    };

    this.centerService.updateCenter(request).subscribe({
      next: () => {
        this.centerService.toggleCenterSports(toggleSportsRequest).subscribe({
          next: () => {
            this.router.navigate(['/admin/centers']);
          },
          error: (err) => {
            console.log(err.error);
          },
        });
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  onSportChange(sportId: number, event: Event): void {
  const checkbox = event.target as HTMLInputElement;

  if (checkbox.checked) {
    this.alreadyCheckedIds.update(ids => [...ids, sportId]);
  } else {
    this.alreadyCheckedIds.update(
      ids => ids.filter(id => id !== sportId)
    );
  }
}

  get name() {
    return this.editForm.get('name') as FormControl;
  }

  get address() {
    return this.editForm.get('address') as FormControl;
  }
}
