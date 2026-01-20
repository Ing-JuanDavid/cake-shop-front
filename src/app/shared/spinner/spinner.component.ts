import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
;

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <svg
      class="animate-spin"
      [ngClass]="sizeClass"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  `,
  styles: [``],
  imports: [NgClass],
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get sizeClass() {
    switch (this.size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-8 w-8';
      default:
        return 'h-6 w-6';
    }
  }
}
