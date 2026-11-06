import { Component, OnInit, signal } from '@angular/core';
import { CourtDTO } from '../../models/court/court';
import { Court } from '../../services/court';
import { ActivatedRoute } from '@angular/router';
import { FullImageUrlPipe } from '../../pipes/full-image-url-pipe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { reservationValidator } from '../../core/validators/reservationValidator';
import { CreateReservationDTO } from '../../models/reservation/create-reservation';
import { Reservation } from '../../services/reservation';

@Component({
  selector: 'app-court-details',
  imports: [FullImageUrlPipe, ReactiveFormsModule],
  templateUrl: './court-details.html',
  styleUrl: './court-details.css',
})
export class CourtDetails implements OnInit {
  court = signal<CourtDTO | null>(null);
  reservationForm: FormGroup;
  reserveButton: boolean = true;

  constructor(
    private courtService: Court,
    private route: ActivatedRoute,
    private reservationService: Reservation,
    public authService: Auth,
    private fb: FormBuilder,
  ) {
    this.reservationForm = fb.group(
      {
        date: ['', [Validators.required]],
        time: ['', [Validators.required]],
      },
      { validators: reservationValidator() },
    );
  }

  ngOnInit(): void {
    this.loadCourt();
  }

  private loadCourt() {
    let courtId = Number(this.route.snapshot.paramMap.get('id'));
    if (courtId <= 0) {
      return;
    }

    this.courtService.getOneCourt(courtId).subscribe({
      next: (court) => {
        this.court.set(court);
      },
      error: (err) => {
        console.log(err.error ?? 'Error while loading court');
      },
    });
  }

  reserve() {
    let courtId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    const request: CreateReservationDTO = {
      courtId: courtId,
      startTime: `${this.reservationForm.get('date')?.value}T${this.reservationForm.get('time')?.value}:00`,
    };

    this.reservationService.createReservation(request).subscribe({
      next: () => {},
      error: (err) => {
        console.log(err);
      },
    });
  }

  minDate = new Date().toISOString().split('T')[0];

  get reservationFormError(): string | null {
    if (this.reservationForm.hasError('dateInPast')) return 'Date cannot be in past';
    if (this.reservationForm.hasError('dateIsSunday')) return 'Selected day cannot be sunday';
    if (this.reservationForm.hasError('notFullHour')) return 'Time must be round hour';
    if (this.reservationForm.hasError('outsideWorkingHours'))
      return 'Our working hours is 07:00-19:00';
    if (this.reservationForm.hasError('timeInPast'))
      return 'Date you have selected is todat,so time cannot be in past';
    return null;
  }

  get time() {
    return this.reservationForm.get('time');
  }

  get date() {
    return this.reservationForm.get('date');
  }
}
