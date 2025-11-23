import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  template: `

  <div class="flex h-screen">
    <div class="hidden md:block w-1/2">
      <img src="assets/auth-image.jpg" alt=""
        class="w-full h-full object-cover">
    </div>

    <div class="text-yellow-900 w-full md:w-1/2 flex justify-center items-center" >
      <div class="w-96">
         <router-outlet/>
      </div>
    </div>
  </div>


  `,
  styles: ``,
})
export class AuthLayoutComponent {

}
