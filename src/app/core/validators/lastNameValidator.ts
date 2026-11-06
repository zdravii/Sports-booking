import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function lastNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';

    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};

    if (value.length < 4) {
        errors['minLength'] = true;
    }

    if (value.length > 50) {
        errors['maxLength'] = true;
    }

    if (!/^[A-Z]/.test(value)) {
        errors['capital'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}
