import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthserviceService } from '../../shared/services/authservice.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  name: string;
  role: string;
  email: string;
  nameid: string;
  exp: number;
}

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  form: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private service: AuthserviceService,
    private toastr: ToastrService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
    });
  }

  onSubmitLogin() {
    this.isSubmitted = true;
  
    if (this.form.valid) {
      this.service.LoginEmployee(this.form.value).subscribe({
        next: (res: any) => {
          if (res && res.token) {
            const decoded: any = jwtDecode(res.token);  // Declare only once
            localStorage.setItem('token', res.token);
            this.form.reset();
            this.isSubmitted = false;
            this.toastr.success('Login Successful', 'Welcome Back!');
  
            // Access role using full claim type
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  
            if (role === 'Admin') {
              this.router.navigate(['/dashboard/admin']);
            } else if (role === 'Employee') {
              this.router.navigate(['/dashboard/employee']);
            }
          }
        },
        error: () => {
          this.toastr.error('Invalid login', 'Error');
        }
      });
    }
  }
  

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(
      control?.invalid &&
      (this.isSubmitted || control.touched || control.dirty)
    );
  }
}
