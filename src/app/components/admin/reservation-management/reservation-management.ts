import { Component, OnInit, signal } from '@angular/core';
import { ReservationDTO } from '../../../models/reservation/reservation';
import { Reservation } from '../../../services/reservation';
import { SearchReservationDTO } from '../../../models/reservation/search-reservation';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Court } from '../../../services/court';
import { Center } from '../../../services/center';
import { CenterDTO } from '../../../models/center/center';
import { CourtDTO } from '../../../models/court/court';
import { SearchCourtDTO } from '../../../models/court/search-court';
import { TableColumn } from '../../../models/table-column';
import { DataTable } from '../../shared/data-table/data-table';
import { SelectOption } from '../../../models/select-option';
import { FromSelect } from "../../shared/from-select/from-select";

@Component({
  selector: 'app-reservation-management',
  imports: [ReactiveFormsModule, DataTable, FromSelect],
  templateUrl: './reservation-management.html',
  styleUrl: './reservation-management.css',
})
export class ReservationManagement implements OnInit {
  reservations = signal<ReservationDTO[] | null>(null);
  errorMessage = signal<string | null>(null);
  centers = signal<CenterDTO[] | null>(null);
  courts = signal<CourtDTO[] | null>(null);
  courtOptions = signal<SelectOption[]>([]);
  centerOptions = signal<SelectOption[]>([]);
  searchForm: FormGroup;
  columns: TableColumn<ReservationDTO>[] = [
    { header: 'Center', field: 'center' },
    { header: 'Court', field: 'court' },
    { header: 'User', field: 'user' },
    { header: 'Start time', field: 'startTime' },
    { header: 'Status', field: 'status' },
  ];

  constructor(
    private reservationService: Reservation,
    private courtService: Court,
    private centerService: Center,
    private fb: FormBuilder,
  ) {
    this.searchForm = fb.group({
      date: [''],
      status: [null],
      centerId: [0],
      courtId: [0],
    });
  }

  search() {
    const request: SearchReservationDTO = {
      pageNumber: 1,
      pageSize: 20,
      centerId: this.searchForm.value.centerId,
      courtId: this.searchForm.value.courtId,
      status: this.searchForm.value.status,
      date: this.searchForm.value.date,
    };

    console.log(request);

    this.reservationService.searchReservation(request).subscribe({
      next: (response) => {
        this.reservations.set(response.items);
      },
    });
  }

  ngOnInit(): void {
    this.loadReservations();
    this.loadCenters();
    this.loadCourts();
  }

  loadReservations() {
    const request: SearchReservationDTO = {
      pageNumber: 1,
      pageSize: 20,
    };

    this.reservationService.searchReservation(request).subscribe({
      next: (response) => {
        this.reservations.set(response.items);
        console.log(response.items);
      },
      error: (err) => {
        this.errorMessage.set('Cannot load reservations');
        console.log(err.error);
      },
    });
  }

  loadCenters() {
    this.centerService.getCenters().subscribe({
      next: (response) => {
        this.centers.set(response.items);
        this.centerOptions.set(response.items.map((c) => ({ value: c.id, label: c.name })));
      },
    });
  }

  loadCourts() {
    const request: SearchCourtDTO = {
      pageNumber: 1,
      pageSize: 20,
    };
    this.courtService.getAllCourts(request).subscribe({
      next: (response) => {
        this.courts.set(response.items);
        this.courtOptions.set(response.items.map((c) => ({ value: c.id, label: c.label })));
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

  get courtId(){
    return this.searchForm.get('courtId') as FormControl;
  }

  get centerId(){
    return this.searchForm.get('centerId') as FormControl;
  }
}
