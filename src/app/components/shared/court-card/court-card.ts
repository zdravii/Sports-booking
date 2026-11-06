import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FullImageUrlPipe } from '../../../pipes/full-image-url-pipe';
import { CourtDTO } from '../../../models/court/court';

@Component({
  selector: 'app-court-card',
  imports: [RouterLink,FullImageUrlPipe],
  templateUrl: './court-card.html',
  styleUrl: './court-card.css',
})
export class CourtCard {
  @Input({required : true}) court!: CourtDTO
}
