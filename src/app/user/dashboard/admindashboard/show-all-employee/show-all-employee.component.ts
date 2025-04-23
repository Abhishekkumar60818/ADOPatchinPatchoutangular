import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-all-employee',
  imports: [CommonModule],
  templateUrl: './show-all-employee.component.html',
  styles: ``
})
export class ShowAllEmployeeComponent implements OnInit {
employeesList: any[] = [];
constructor(private http: HttpClient){

}
ngOnInit(): void {
  this.fetchAllEmployees();
}
fetchAllEmployees(): void {
  const token = localStorage.getItem('token');
  if(!token) {
    console.error('No token found!');
    return;
  }
  const headers =new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.get<any[]>('http://192.168.29.15:5191/api/Admin/ShowAllEmployees', { headers })
  .subscribe({
    next: (data) =>{
    
      this.employeesList = data;
    },
    error: (err) => {
      console.error('Error fetching employee attendance:', err);
    }
  });
}

}
