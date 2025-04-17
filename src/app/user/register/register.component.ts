import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthserviceService } from '../../shared/services/authservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,RouterModule,CommonModule,FirstKeyPipe],
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent {
  form :FormGroup;
  isSubmitted :boolean= false;
  constructor(public formBuilder: FormBuilder,private service : AuthserviceService,private toastr: ToastrService) {
    this.form = this.formBuilder.group({
      name: ['',Validators.required],
      email : ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required,Validators.minLength(6),Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
      department: ['',Validators.required],
      
    })
  }
  onSubmitRegister(){
    this.isSubmitted = true;
    if(this.form.valid){
      this.service.createEmployee(this.form.value).subscribe({
        next :(res : any) =>{

          if(res.succeeded){
            this.form.reset();
            this.isSubmitted = false;
            this.toastr.success('New Employee created!', 'Registration Successful');
          }
        },
        error: (err) => {
          if (err.error.errors) {
            err.error.errors.forEach((x: any) => {
              switch (x.code) {
                case 'DuplicateUserName':
                  this.toastr.error('Username is already taken.', 'Registration Failed');
                  break;
                case 'DuplicateEmail':
                  this.toastr.error('Email is already taken.', 'Registration Failed');
                  break;
                default:
                  this.toastr.error('Contact the developer', 'Registration Failed');
                  console.log(x);
                  break;
              }
            });
          } else {
            console.log('error:', err);
          }
        }
      });
    }
    // console.log(this.form.value);
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(
      control?.invalid &&
      (this.isSubmitted || control.touched || control.dirty)
    );
  }

}
