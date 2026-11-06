import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Center } from '../../../../services/center';
import { Sport } from '../../../../services/sport';
import { Router } from '@angular/router';
import { CreateSportDTO } from '../../../../models/sport/create-sport';
import { FormInput } from "../../../shared/form-input/form-input";

@Component({
  selector: 'app-sport-create',
  imports: [ReactiveFormsModule, FormInput],
  templateUrl: './sport-create.html',
  styleUrl: './sport-create.css',
})
export class SportCreate {
  createForm: FormGroup;
  errorMessage = signal<string | null>(null);
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private sportService: Sport,
    private router: Router,
  ) {
    this.createForm = fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      description: ['', [Validators.required,Validators.minLength(20), Validators.maxLength(500)]],
    });
  }

  onSubmit() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const request: CreateSportDTO = this.createForm.value;

    this.sportService.createSport(request).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/sports']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message ?? 'Cannot create center');
      },
    });
  }

  get name(){
    return this.createForm.get('name') as FormControl;
  }

  get description(){
    return this.createForm.get('description') as FormControl;
  }
}
