import { CommonModule } from '@angular/common'; 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthserviceService } from '../../shared/services/authservice.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, FirstKeyPipe],
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  isSubmitted: boolean = false;
  headers: HttpHeaders | undefined;

  constructor(
    public formBuilder: FormBuilder,
    private service: AuthserviceService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
      department: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role !== 'Admin') {
        this.router.navigate(['/unauthorized']); // or dashboard/employee
        return;
      }

      this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } catch (err) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  onSubmitRegister() {
    this.isSubmitted = true;
    if (this.form.valid && this.headers) {
      this.service.createEmployee(this.form.value, { headers: this.headers }).subscribe({
        next: (res: any) => {
          if (res) {
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
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control?.invalid && (this.isSubmitted || control.touched || control.dirty));
  }
}
