import { Component, Input } from '@angular/core';
import { RateService } from '../../shared/services/rate.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'rate-list',
  imports: [AsyncPipe],
  template: `
     @if (rateList$ | async; as rateList) {
      <div class="space-y-4 mt-10">

        @for (rate of rateList; track rate.rateId) {
          <div class="bg-yellow-50 border border-yellow-100 rounded-lg p-4 shadow-sm">

            <!-- User -->
            <div class="flex items-center justify-between mb-2">
              <p class="font-semibold text-yellow-900">
                {{ rate.userName }}
              </p>
              <span class="text-sm text-yellow-700">
                {{ rate.score }}/5 ⭐
              </span>
            </div>

            <!-- Comment -->
            <p class="text-yellow-800 text-sm leading-relaxed">
              {{ rate.comment }}
            </p>

          </div>
        }

      </div>
    }
  `,
  styles: ``,
})
export class RateListComponent {
  @Input() id:string | null = null;
  rateList$!: Observable<any>;

  constructor(
    private rateService:RateService
  ){}

  ngOnInit()
  {
    this.rateList$ = this.rateService.getRatesByProduct(this.id!).pipe(
      map(rate=>rate.data)
    );
  }
}
