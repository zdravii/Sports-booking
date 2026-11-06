import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function firstNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';

    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};

    if (value.length < 3) {
        errors['minLength'] = true;
    }

    if (value.length > 25) {
        errors['maxLength'] = true;
    }

    if (!/^[A-Z]/.test(value)) {
        errors['capital'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}
