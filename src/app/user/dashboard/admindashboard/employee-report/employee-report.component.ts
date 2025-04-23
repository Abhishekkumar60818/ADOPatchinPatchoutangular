import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { MillisecondsToMinutesPipe } from '../../../../shared/pipes/milliseconds-to-minutes.pipe';

@Component({
  selector: 'app-employee-report',
  imports: [CommonModule,TruncatePipe,MillisecondsToMinutesPipe],
  standalone: true,
  templateUrl: './employee-report.component.html',
  styles: ``
})
export class EmployeeReportComponent implements OnInit {

  attendances: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchEmployeeAttendance();
  }

  fetchEmployeeAttendance(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://192.168.29.15:5191/api/Admin/GetAllEmployeeAttendences', { headers })
      .subscribe({
        next: (data) => {
          this.attendances = data;
        },
        error: (err) => {
          console.error('Error fetching employee attendance:', err);
        }
      });
  }
}
