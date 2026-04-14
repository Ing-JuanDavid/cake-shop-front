import { Component, Input } from "@angular/core";

@Component({
  selector: 'info-view-not-found',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center gap-3 py-12 text-yellow-900/50 min-h-96">
      <i class="fa-solid fa-box-open fa-2xl"></i>
      <p class="text-sm font-semibold uppercase tracking-widest">{{ msj }}</p>
    </div>
  `,
})
export class NotFoundView {
  @Input() msj!: string;
}
