import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { Reservation } from '../../services/reservation';
import { LoginResponseDTO } from '../../models/auth/login-response';
import { ReservationDTO } from '../../models/reservation/reservation';
import { SearchReservationDTO } from '../../models/reservation/search-reservation';
import { PaginationRequest } from '../../models/pagination-request';

@Component({
  selector: 'app-reservation-list',
  imports: [],
  templateUrl: './reservation-list.html',
  styleUrl: './reservation-list.css',
})
export class ReservationList implements OnInit {
  user = signal<LoginResponseDTO | null>(null);
  reservations = signal<ReservationDTO[] | null>(null);

  constructor(
    private reservationService: Reservation,
  ) {}

  ngOnInit(): void {
    const request: PaginationRequest = {
      pageNumber: 1,
      pageSize: 20,
    };
    this.reservationService.getCurrentUserReservations(request).subscribe({
      next: (response) => {
        this.reservations.set(response.items);
        console.log(this.reservations);
      },
    });
  }

  public status(status: number): string {
    if (status == 1) return 'Confirmed';
    if (status == 2) return 'Canceled';
    else return 'Completed';
  }

  public date(date: string): string {
    const newDate = new Date(date);

    return newDate.toLocaleString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
