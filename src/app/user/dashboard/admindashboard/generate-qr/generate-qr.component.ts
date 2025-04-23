import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-generate-qr',
  templateUrl: './generate-qr.component.html',
  imports: [CommonModule],
})
export class GenerateQrComponent {
  qrCodeBase64: string | null = null;
  message: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // You can call API here if you want QR code on load
    // this.generateQRCode(); // optional
  }

  generateQRCode(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.isLoading = true;

    this.http.post<any>('https://192.168.29.15:5191/api/Admin/GenerateQRCode', {}, { headers })
      .subscribe({
        next: (data) => {
          this.message = data.message;
          this.qrCodeBase64 = data.qrCode;
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('QR Code generation failed:', error);
          this.message = 'Error generating QR Code.';
          this.qrCodeBase64 = null;
          this.isLoading = false;
        }
      });
  }
}
