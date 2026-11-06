import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sport } from '../../../../services/sport';
import { ActivatedRoute, Router } from '@angular/router';
import { EditSportDTO } from '../../../../models/sport/edit-sport';
import { FormInput } from "../../../shared/form-input/form-input";

@Component({
  selector: 'app-sport-edit',
  imports: [ReactiveFormsModule, FormInput],
  templateUrl: './sport-edit.html',
  styleUrl: './sport-edit.css',
})
export class SportEdit implements OnInit {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sportService: Sport,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required,Validators.minLength(4), Validators.maxLength(50)]],
      description: ['', [Validators.required,Validators.minLength(30),Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    let sportId = Number(this.route.snapshot.paramMap.get('id'));
    this.sportService.getOneSport(sportId).subscribe({
      next: (sport) => {
        this.editForm.patchValue({
          name: sport.name,
          description: sport.description,
        });
      },
      error: (err) => {
        console.log(err);
      },
    }); 
  }

  editCenter() {
    let sportId = Number(this.route.snapshot.paramMap.get('id'));
    const request: EditSportDTO = {
      sportId: sportId,
      name: this.editForm.value.name,
      description: this.editForm.value.description,
    };

    this.sportService.updateSport(request).subscribe({
      next: () => {
        this.router.navigate(['/admin/sports']);
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  get name() {
    return this.editForm.get('name') as FormControl;
  }

  get description() {
    return this.editForm.get('description') as FormControl;
  }
}
