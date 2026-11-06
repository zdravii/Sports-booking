import { Component, Input } from '@angular/core';
import { CenterDTO } from '../../../models/center/center';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-center-card',
  imports: [RouterLink],
  templateUrl: './center-card.html',
  styleUrl: './center-card.css',
})
export class CenterCard {
  @Input({ required: true }) center!: CenterDTO;
}
