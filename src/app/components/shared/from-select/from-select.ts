import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '../../../models/select-option';

@Component({
  selector: 'app-from-select',
  imports: [ReactiveFormsModule],
  templateUrl: './from-select.html',
  styleUrl: './from-select.css',
})
export class FromSelect {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) options!: SelectOption[];
  @Input() placeholder = 'Select an option';
  @Input() errorMessages: Record<string, string> = {};

  get errorKeys(): string[] {
    if (!this.control.errors) return [];
    return Object.keys(this.control.errors);
  }
}
