import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-my-report',
  imports: [CommonModule,TruncatePipe],
  templateUrl: './my-report.component.html',
  styles: ``
})
export class MyReportComponent implements OnInit {
myattendenceData :any =[];
constructor(private http :HttpClient){}

ngOnInit(): void{
  this.Mydata();
}
Mydata () : void{
  const token = localStorage.getItem('token');
  if(!token) {
    console.error('No token found!');
    return;
  }
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.get<any[]>('https://192.168.29.15:5191/api/Employees/my-attendance', { headers })
  .subscribe({
    next :(data) =>{
      
      this.myattendenceData = data;

    },
    error: (err) => {
      console.error('Error loading attendance:', err);
    }
  })
}

}
