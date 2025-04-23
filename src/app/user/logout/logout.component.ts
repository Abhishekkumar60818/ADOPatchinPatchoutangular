import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styles: ``
})
export class LogoutComponent {
  constructor( private toastr: ToastrService,private router : Router) {
   localStorage.clear();

   this.toastr.info('Logout Successful', 'Fir Milenge!');
   this.router.navigate(['/login']);
}
}