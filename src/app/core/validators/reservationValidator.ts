import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function reservationValidator():ValidatorFn{
    return(control:AbstractControl):ValidationErrors | null =>{
        const dateValue = control.get('date')?.value;
        const timeValue = control.get('time')?.value;
        const errors:ValidationErrors = {};

        if (!dateValue || !timeValue) {
            return null;
        }

        const selectedDate = new Date(`${dateValue}T00:00:00`);

        const today = new Date();
        today.setHours(0,0,0,0);

        if (selectedDate < today) {
            errors['dateInPast'] = true;
        }

        if (selectedDate.getDay() === 0) {
            errors['dateIsSunday'] = true;
        }

        const [hours,minutes] = timeValue.split(`:`).map(Number);

        if (minutes !== 0) {
            errors['notFullHour'] = true;
        }

        if (hours < 7 || hours > 19) {
            errors['outsideWorkingHours'] = true;
        }

        if (selectedDate.getTime() === today.getTime()) {
            const now = new Date();
            if (hours < now.getHours()) {
                errors['timeInPast'] = true;
            }
        }

        return Object.keys(errors).length > 0 ? errors : null;
    }
}