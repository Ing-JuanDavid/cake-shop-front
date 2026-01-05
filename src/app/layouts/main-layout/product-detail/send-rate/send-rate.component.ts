import { Component } from '@angular/core';
import { InteractiveStars } from "../interactive-stars/interactive-stars.component";

@Component({
  selector: 'rate-send-rate',
  imports: [InteractiveStars],
  template: `
    <div class="p-5 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm">
      <h3 class="text-lg font-semibold text-yellow-900 mb-3">Deja tu calificación</h3>

      <product-details-interactive-stars (scoreChange)="onRate($event)"></product-details-interactive-stars>

      <label for="comment" class="block text-sm font-medium text-yellow-800 mb-1">
        Comentario
      </label>

      <textarea
        id="comment"
        name="description"
        rows="4"
        placeholder="Cuéntanos tu experiencia con este producto..."
        class="w-full resize-none rounded-md border border-yellow-300
             bg-white px-3 py-2 text-sm text-yellow-900
             focus:outline-none focus:ring-2 focus:ring-yellow-400
             focus:border-yellow-400 transition"
      ></textarea>

      <div class="mt-4 flex justify-end">
        <button
          class="px-4 py-2 bg-yellow-600 text-white text-sm font-medium
               rounded-md hover:bg-yellow-700 transition"
        >
          Enviar calificación
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class SendRate {

  onRate(score:number){
    console.log('current score: ', score);
  }

}
