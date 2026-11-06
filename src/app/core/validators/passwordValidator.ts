import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function StrongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';

    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};

    if (value.length < 8) {
        errors['minLength'] = true;
    }

    if (!/[a-z]/.test(value)) {
        errors['lowercase'] = true;
    }

    if (!/[A-Z]/.test(value)) {
        errors['uppercase'] = true;
    }

    if (!/\d/.test(value)) {
        errors['digit'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}
