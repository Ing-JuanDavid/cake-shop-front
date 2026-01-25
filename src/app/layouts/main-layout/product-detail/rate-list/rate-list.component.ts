import { Component, Input, SimpleChanges } from '@angular/core';
import { StarsComponent } from "../stars/stars.component";
import { Rate } from '../../../../core/models/rate.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rate-rate-list',
  imports: [StarsComponent, CommonModule],
  template: `
    @if (rateList) {
      @for (rate of rateList; track rate.rateId) {
        <div class="bg-yellow-50 border border-yellow-100 rounded-lg p-4 shadow-sm mb-5">
          <div class="flex items-center justify-between mb-2">
            <div>
              <p class="font-semibold text-yellow-900">
                {{ rate.userName }}
              </p>
              <p class="text-yellow-700 text-sm leading-relaxed">
                {{ rate.comment }}
              </p>
            </div>

            <div class="flex flex-col items-end">
              <p class="text-sm text-yellow-700 mb-1">{{ rate.creationDate | date: 'mediumDate' }}</p>
              <product-details-stars [score]="rate.score"></product-details-stars>
            </div>
          </div>
        </div>
      }
    }
  `,
  styles: ``,
})
export class RateList {
  @Input() rateList: Rate[] | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rateList']) {
      console.log('rate list: ', this.rateList);
    }
  }
}
