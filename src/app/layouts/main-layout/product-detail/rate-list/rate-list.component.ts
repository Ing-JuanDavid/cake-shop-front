import { Component, Input, SimpleChanges } from '@angular/core';
import { StarsComponent } from "../stars/stars.component";
import { map, Observable } from 'rxjs';
import { Rate, RateService } from '../../../../core/services/rate.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'rate-rate-list',
  imports: [StarsComponent],
  template: `
    @if(rateList) {
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

          <product-details-stars [score]="rate.score"></product-details-stars>
        </div>
      </div>
      }
    }
  `,
  styles: ``,
})

export class RateList {
  @Input() rateList: Rate[] | null = null;
}
