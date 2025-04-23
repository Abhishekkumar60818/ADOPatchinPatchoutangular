import { Component, ViewChild, ElementRef } from '@angular/core';
import jsQR from 'jsqr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.component.html',
})
export class ScanQrComponent {
  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  stream: MediaStream | null = null;
  scanning = false;
  resultMessage = '';

  constructor(private http: HttpClient) {}

  startScan(): void {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support accessing the camera.");
      return;
    }
  
    const videoEl = this.video.nativeElement;
    const canvasEl = this.canvas.nativeElement;
    const scanBtn = document.getElementById("scanBtn")!;
    const closeBtn = document.getElementById("closeBtn")!;
    const context = canvasEl.getContext('2d')!;
  
    videoEl.classList.remove("d-none");
    closeBtn.classList.remove("d-none");
    scanBtn.classList.add("d-none");
  
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        this.stream = stream;
        videoEl.srcObject = stream;
        videoEl.play();
        this.scanning = true;
        requestAnimationFrame(() => this.scanQRCode(context));
      })
      .catch(err => {
        alert("Camera access denied or not available.");
        this.resetUI();
      });
  }
  
  

  scanQRCode(context: CanvasRenderingContext2D): void {
    if (!this.scanning) return;

    const videoEl = this.video.nativeElement;
    const canvasEl = this.canvas.nativeElement;

    if (videoEl.readyState === videoEl.HAVE_ENOUGH_DATA) {
      canvasEl.width = videoEl.videoWidth;
      canvasEl.height = videoEl.videoHeight;
      context.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

      const imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height);
      let ConvertedData = new Uint8ClampedArray(imageData.data);
      const code = jsQR(ConvertedData, imageData.width, imageData.height);

      if (code) {
        this.scanning = false;
        this.stopCamera();
        this.sendQRCodeToServer(code.data);
        return;
      }
    }
    requestAnimationFrame(() => this.scanQRCode(context));
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.scanning = false;
    this.resetUI();
  }

  resetUI(): void {
    this.video.nativeElement.classList.add("d-none");
    document.getElementById("closeBtn")!.classList.add("d-none");
    document.getElementById("scanBtn")!.classList.remove("d-none");
  }

  sendQRCodeToServer(scannedQRCode: string): void {
    const apiUrl = 'https://192.168.29.15:5191/api/Employees/scan-qr';
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('No token found!');
      return;
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    const body = `"${scannedQRCode}"`; 
  
    this.http.post<{ message: string }>(apiUrl, body, { headers }).subscribe({
      next: res => {
        this.resultMessage = res.message;
        setTimeout(() => this.resultMessage = '', 3000);
      },
      error: err => {
        this.resultMessage = 'Error processing QR Code.';
        console.error('QR Code Error:', err);
      }
    });
  }
  
  
  
  
}
