import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductImage } from '../../../../core/models/productImage.model';

@Component({
  selector: 'product-image-picker',
  standalone: true,
  imports: [],
  template: `
    @if (isOpen) {

      <!-- Backdrop -->
      <div class="fixed inset-0 z-50 flex items-center justify-center px-4"
           style="background: rgba(0,0,0,0.5)"
           (click)="close()">

        <!-- Panel -->
        <div class="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl"
             (click)="$event.stopPropagation()">

          <!-- Header -->
          <div class="flex items-center justify-between mb-5 border-b border-yellow-900/20 pb-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50 mb-0.5">Imágenes</p>
              <h3 class="text-lg font-semibold uppercase tracking-widest text-yellow-900">Seleccionar principal</h3>
            </div>
            <button (click)="close()" class="text-yellow-900/30 hover:text-yellow-900 transition-colors">
              <i class="fa-solid fa-xmark fa-lg"></i>
            </button>
          </div>

          <!-- Images grid -->
          <div class="grid grid-cols-4 gap-3">
            @for (img of images; track img.imageId) {
              <div
                (click)="select(img)"
                class="relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all"
                [class.border-yellow-900]="selected?.imageId === img.imageId"
                [class.border-transparent]="selected?.imageId !== img.imageId">

                <img [src]="img.imageUrl" [alt]="'Image ' + img.imageId"
                  class="w-full h-full object-cover" />

                <!-- Selected overlay -->
                @if (selected?.imageId === img.imageId) {
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <i class="fa-solid fa-check text-white text-lg"></i>
                  </div>
                }

              </div>
            } @empty {
              <div class="col-span-4 flex flex-col items-center gap-3 py-8 text-yellow-900/40">
                <i class="fa-regular fa-image fa-2xl"></i>
                <p class="text-xs font-semibold uppercase tracking-widest">Sin imágenes</p>
              </div>
            }
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 mt-5 pt-4 border-t border-yellow-900/10">
            <button (click)="close()"
              class="text-xs text-yellow-900/50 hover:text-yellow-900 transition-colors px-4 py-2 cursor-pointer">
              Cancelar
            </button>
            <button (click)="confirm()"
              [disabled]="!selected"
              class="flex items-center gap-2 border border-yellow-900 text-yellow-900 px-5 py-2 rounded-full text-xs font-semibold
                     hover:bg-yellow-900 hover:text-yellow-50 transition-all
                     disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <i class="fa-solid fa-check text-xs"></i>
              Confirmar
            </button>
          </div>

        </div>
      </div>
    }
  `,
  styles: ``
})
export class ProductImagePicker {

  @Input() images: ProductImage[] = [];
  @Input() currentMain: ProductImage | null = null;
  @Output() mainSelected = new EventEmitter<ProductImage>();

  isOpen = false;
  selected: ProductImage | null = null;

  open() {
    this.selected = this.currentMain;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.selected = null;
  }

  select(img: ProductImage) {
    this.selected = img;
  }

  confirm() {
    if (!this.selected) return;
    if(this.selected.imageId == this.currentMain?.imageId) {
      console.log('this image has been already selected');
      return
    }
    this.mainSelected.emit(this.selected);
    this.close();
  }
}
