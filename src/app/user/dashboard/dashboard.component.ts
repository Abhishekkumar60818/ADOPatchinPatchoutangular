import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { EmployeedashboardComponent } from './employeedashboard/employeedashboard.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [AdmindashboardComponent,EmployeedashboardComponent,RouterOutlet],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {

  userRole :string ='';
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      // Adjust based on your token structure
      this.userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    }
}
}