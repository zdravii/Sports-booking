import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  imports: [ReactiveFormsModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css',
})
export class FormInput {
  @Input({required:true}) control!:FormControl;
  @Input({required:true}) label!:string;
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() errorMessage: Record<string,string> = {};

  get errorKeys():string[]{
    if (!this.control.errors) return [];
    return Object.keys(this.control.errors);
  }
}
