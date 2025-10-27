import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTelefonMask]',
  standalone: true // Standalone olması şart
})
export class TelefonMaskDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');


    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = value.substring(0, 3);
    }
    if (value.length > 3) {
      formattedValue += '-' + value.substring(3, 6);
    }
    if (value.length > 6) {
      formattedValue += '-' + value.substring(6, 8);
    }
    if (value.length > 8) {
      formattedValue += '-' + value.substring(8, 10);
    }

    input.value = formattedValue;
  }
}
