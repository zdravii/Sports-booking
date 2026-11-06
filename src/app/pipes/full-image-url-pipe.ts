import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Pipe({
  name: 'fullImageUrl',
  standalone: true,
})
export class FullImageUrlPipe implements PipeTransform {
  transform(path: string | null | undefined): string {
    if (!path) return '';
    return `${environment.apiBaseUrl}${path}`;
  }
}
