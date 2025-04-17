import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthserviceService } from '../../shared/services/authservice.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  standalone :true,
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterModule,CommonModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  form :FormGroup;
  isSubmitted :boolean= false;
  constructor(public formBuilder: FormBuilder,private service : AuthserviceService,private toastr : ToastrService){
this.form =this.formBuilder.group({
  email: ['',[Validators.required,Validators.email]],
  password: ['',[Validators.required,Validators.minLength(6),Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
})
  }
  onSubmitLogin(){
    this.isSubmitted = true;
    if(this.form.valid){
      this.service.LoginEmployee(this.form.value).subscribe({
        next :(res :any ) =>{
          if(res.succeeded){
            this.form.reset();
            this.isSubmitted = false;
            this.toastr.success('Login Successful', 'Welcome Back!');
          }
        },

      })
    }
    console.log(this.form.value);
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(
      control?.invalid &&
      (this.isSubmitted || control.touched || control.dirty)
    );
  }
}
