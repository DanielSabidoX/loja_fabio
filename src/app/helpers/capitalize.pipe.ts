import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeWords',
  standalone: true
})
export class CapitalizeWordsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/\b\w/g, char => char.toUpperCase());
  }
}