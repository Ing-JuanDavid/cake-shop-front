import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'product-details-interactive-stars',
  standalone: true,
  imports: [NgClass],
  template: `
     <div class="flex items-center gap-1">
            @for (star of [1,2,3,4,5]; track star) {
            <svg
              class="w-8 h-8 hover:cursor-pointer"
              [ngClass]="star <= score ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'"
              fill="currentColor"
              viewBox="0 0 20 20"
              (click)="selectStar(star)"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1
                        1 0 00.95.69h4.173c.969 0 1.371 1.24.588
                        1.81l-3.377 2.455a1 1 0 00-.364
                        1.118l1.287 3.966c.3.922-.755
                        1.688-1.538 1.118l-3.377-2.454a1
                        1 0 00-1.175 0l-3.377 2.454c-.783
                        .57-1.838-.196-1.538-1.118l1.287-3.966a1
                        1 0 00-.364-1.118L2.174 9.394c-.783-.57-.38-1.81.588-1.81h4.173a1
                        1 0 00.95-.69l1.286-3.967z"
              />
            </svg>
            }
          </div>
  `,
  styles: ``,
})
export class InteractiveStars {
  score: number = 0;
  @Output() scoreChange = new EventEmitter<number>();

  selectStar(star : number) {
    this.score = star;
    this.scoreChange.emit(star);

  }
}
