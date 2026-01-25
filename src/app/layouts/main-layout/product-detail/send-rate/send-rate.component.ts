import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InteractiveStars } from "../interactive-stars/interactive-stars.component";
import { FormsModule } from "@angular/forms";
import { RateService } from '../../services/rate.service';
import { Rate } from '../../../../core/models/rate.model';
import { AlertService } from '../../services/alert.service';
import { SpinnerComponent } from "../../../../shared/spinner/spinner.component";
import { finalize } from 'rxjs';
import { UserService } from '../../../../core/user/user.service';

@Component({
  selector: 'rate-send-rate',
  standalone: true,
  imports: [InteractiveStars, FormsModule, SpinnerComponent],
  template: `
    <div class="p-5 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm">
      <h3 class="text-lg font-semibold text-yellow-900 mb-3">Deja tu calificación</h3>

      <product-details-interactive-stars
        [foundRate]="foundRate"
        (scoreChange)="onRate($event)"
      ></product-details-interactive-stars>

      <label for="comment" class="block text-sm font-medium text-yellow-800 mb-1">
        Comentario
      </label>

      <textarea
        id="comment"
        name="comment"
        rows="4"
        [(ngModel)]="comment"
        placeholder="Cuéntanos tu experiencia con este producto..."
        class="w-full resize-none rounded-md border border-yellow-300
             bg-white px-3 py-2 text-sm text-yellow-900
             focus:outline-none focus:ring-2 focus:ring-yellow-400
             focus:border-yellow-400 transition"
      ></textarea>

      <div class="mt-4 flex justify-end gap-2">
        @if (foundRate) {
          <button
            (click)="deleteRate()"
            class="px-4 py-2 bg-red-600 text-white text-sm font-medium
               rounded-md hover:bg-red-700 transition hover:cursor-pointer"
          >
            Borrar calificación
          </button>
        }

        <button
          [disabled]="loading"
          (click)="!foundRate ? sendRate() : updateRate()"
          class="px-4 py-2 bg-yellow-600 text-white text-sm font-medium
                rounded-md hover:bg-yellow-700 transition hover:cursor-pointer"
        >
          @if (!loading && !foundRate) {
            Enviar calificación
          } @else if (!loading && foundRate) {
            Actualizar calificación
          } @else {
            <app-spinner [size]="'sm'"></app-spinner>
          }
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class SendRate {
  @Input() productId: string = '';
  @Output() updatedData = new EventEmitter();
  loading = false;
  comment: string = '';
  score: number = 0;
  foundRate: Rate | null = null;

  constructor(
    private rateService: RateService,
    private alertService: AlertService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    if (this.userService.currentUser()) {
      this.rateService.getRates(this.productId).subscribe({
        next: (res) => {
          this.setRate(res.data);
        },
      });
    }
  }

  setRate(rate: Rate | null) {
    if (rate) {
      this.foundRate = rate;
      this.comment = rate.comment;
      this.score = rate.score;
    }
  }

  onRate(score: number) {
    this.score = score;
  }

  sendRate() {
    this.loading = true;

    this.rateService
      .sendRate(this.productId, { score: this.score, comment: this.comment })
      .pipe(
        // finalize se ejecuta siempre al terminar el observable (success o error)
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (res) => {
          this.alertService.success('Calificación realizada exitosamente');
          this.foundRate = res.data;
          this.updatedData.emit();
          setTimeout(() => this.alertService.clear(), 3000);
        },
        error: (err) => {
          this.alertService.error('Error al enviar calificación');
          setTimeout(() => this.alertService.clear(), 3000);
        },
      });
  }

  updateRate() {
    if (!this.foundRate) return;

    this.loading = true;

    this.rateService
      .updateRate(this.productId, this.foundRate.rateId.toString(), {
        score: this.score,
        comment: this.comment,
      })
      .pipe(
        // finalize se ejecuta siempre al terminar el observable (success o error)
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (res) => {
          this.alertService.success('Calificación actualizada exitosamente');
          this.updatedData.emit();
          setTimeout(() => this.alertService.clear(), 3000);
        },
        error: (err) => {
          this.alertService.error('Error al actualizar calificación');
          setTimeout(() => this.alertService.clear(), 3000);
        },
      });
  }

  deleteRate() {
    if (!this.foundRate) return;
    this.loading = true;
    this.rateService
      .deleteRate(this.foundRate.rateId)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        {
          next: (res) => {
            this.alertService.success('Calificacion eliminada correctamente');
            this.foundRate = null;
            this.score = 0;
            this.comment = '';
            this.updatedData.emit();
            setTimeout(() => this.alertService.clear(), 3000);
          },

          error: (err) => {
            this.alertService.error('Error al eliminar calificación');
            setTimeout(() => {
              (this.alertService.clear(), 3000);
            });
          },
        },
      );
  }
}
