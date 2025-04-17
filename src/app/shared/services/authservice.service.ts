import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http:HttpClient) { }
  baseUrl ='https://localhost:7140/api/Account';
  createEmployee(formData : any ){
    return this.http.post(this.baseUrl + '/Register',formData);
  }
  LoginEmployee(formData :any){
return this.http.post(this.baseUrl + '/Login',formData);
  }
}
