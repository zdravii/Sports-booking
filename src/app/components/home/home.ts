import { Component, OnInit, signal } from '@angular/core';
import { Center } from '../../services/center';
import { CenterDTO } from '../../models/center/center';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchCentersDTO } from '../../models/center/search-centers';
import { CenterCard } from '../shared/center-card/center-card';
import { FormInput } from "../shared/form-input/form-input";

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, ReactiveFormsModule, CenterCard, FormInput],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  centers = signal<CenterDTO[]>([]);
  isLaoding = signal(true);
  errorMessage = signal<string | null>(null);

  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private centerService: Center,
  ) {
    this.searchForm = fb.group({
      name: [''],
    });
  }

  ngOnInit(): void {
    this.loadCenters();
  }

  onSubmit(): void {
    this.loadCenters();
  }

  private loadCenters(): void {
    this.isLaoding.set(true);
    this.errorMessage.set(null);

    const request: SearchCentersDTO = {
      pageNumber: 1,
      pageSize: 20,
      name: this.searchForm.value.name || undefined,
    };

    this.centerService.searchCenters(request).subscribe({
      next: (result) => {
        this.centers.set(result.items);
        this.isLaoding.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load centers');
        this.isLaoding.set(false);
      },
    });
  }

  get name(){
    return this.searchForm.get('name') as FormControl;
  }
}
