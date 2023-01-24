import { DatePipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
})
export class CustomDatePipe extends DatePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) locale: string) {
    super(locale);
  }

  override transform(value: Date | string | number): string | null;
  override transform(value: null | undefined): null;
  override transform(
    value: Date | string | number | null | undefined
  ): string | null;
  override transform(
    value: Date | string | number | null | undefined
  ): string | null {
    return super.transform(value, 'dd.MM.yyyy HH:mm');
  }
}
