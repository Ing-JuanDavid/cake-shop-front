import { Component, Input } from '@angular/core';
import { StarsComponent } from "../stars/stars.component";

@Component({
  selector: 'rate-rate-list',
  imports: [StarsComponent],
  template: `
    <div class="mt-5">
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
        </div>
  `,
  styles: ``,
})
export class RateList {
  @Input() rateList : any = [];
}
