import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'main-layout-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-yellow-900/20 mt-16 px-6 py-10 text-yellow-900">

      <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">

        <!-- Brand -->
        <div class="flex flex-col gap-3">
          <span class="font-[Kaushan] text-3xl">Shaylu</span>
          <p class="text-sm text-yellow-900/50 leading-relaxed">
            Encuentra los mejores productos con la calidad que mereces.
          </p>
          <div class="flex items-center gap-4 mt-1">
            <a href="#" class="text-yellow-900/40 hover:text-yellow-700 transition-colors">
              <i class="fa-brands fa-instagram fa-lg"></i>
            </a>
            <a href="#" class="text-yellow-900/40 hover:text-yellow-700 transition-colors">
              <i class="fa-brands fa-facebook fa-lg"></i>
            </a>
            <a href="#" class="text-yellow-900/40 hover:text-yellow-700 transition-colors">
              <i class="fa-brands fa-x-twitter fa-lg"></i>
            </a>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex flex-col gap-3">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-yellow-900/60">Navegación</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a routerLink="home" class="flex items-center gap-2 text-yellow-900/70 hover:text-yellow-700 transition-colors">
                <i class="fa-solid fa-house text-xs"></i> Home
              </a>
            </li>
            <li>
              <a routerLink="contact" class="flex items-center gap-2 text-yellow-900/70 hover:text-yellow-700 transition-colors">
                <i class="fa-solid fa-envelope text-xs"></i> Contacto
              </a>
            </li>
            <li>
              <a routerLink="auth" class="flex items-center gap-2 text-yellow-900/70 hover:text-yellow-700 transition-colors">
                <i class="fa-solid fa-right-to-bracket text-xs"></i> Ingresar
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="flex flex-col gap-3">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-yellow-900/60">Contacto</h3>
          <ul class="space-y-2 text-sm text-yellow-900/70">
            <li class="flex items-center gap-2">
              <i class="fa-solid fa-envelope text-xs text-yellow-900/40"></i>
              <span>contacto&#64;shaylu.com</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="fa-solid fa-phone text-xs text-yellow-900/40"></i>
              <span>+57 300 000 0000</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="fa-solid fa-location-dot text-xs text-yellow-900/40"></i>
              <span>Colombia</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="max-w-7xl mx-auto mt-10 pt-5 border-t border-yellow-900/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-yellow-900/40">
        <span class="text-yellow-900">© {{ year }} Shaylu. Juan Salgado. Todos los derechos reservados.</span>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-yellow-700 transition-colors">Términos</a>
          <a href="#" class="hover:text-yellow-700 transition-colors">Privacidad</a>
        </div>
      </div>

    </footer>
  `,
  styles: ``,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
