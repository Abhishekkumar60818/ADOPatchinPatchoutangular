import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http:HttpClient) { }
  baseUrl ='http://192.168.29.15:5191/api/Account';
  createEmployee(formData: any, options?: any) {
    return this.http.post(this.baseUrl + '/Register', formData, options);
  }
  
  LoginEmployee(formData :any){
return this.http.post(this.baseUrl + '/Login',formData);
  }
}
