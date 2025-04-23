import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { AdmindashboardComponent } from './user/dashboard/admindashboard/admindashboard.component';
import { EmployeedashboardComponent } from './user/dashboard/employeedashboard/employeedashboard.component';
import { authGuard } from './shared/guards/auth.guard';
import { EmployeeReportComponent } from './user/dashboard/admindashboard/employee-report/employee-report.component';
import { ShowAllEmployeeComponent } from './user/dashboard/admindashboard/show-all-employee/show-all-employee.component';
import { GenerateQrComponent } from './user/dashboard/admindashboard/generate-qr/generate-qr.component';
import { MyReportComponent } from './user/dashboard/employeedashboard/my-report/my-report.component';
import { ScanQrComponent } from './user/dashboard/employeedashboard/scan-qr/scan-qr.component';
import { LogoutComponent } from './user/logout/logout.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    // { path: 'register', component: RegisterComponent },
    {path: 'dashboard/admin', component :AdmindashboardComponent,canActivate: [authGuard],
        children : [
            {path : 'employee-report', component :EmployeeReportComponent,canActivate: [authGuard]},
            {path : 'show-all-employee', component :ShowAllEmployeeComponent,canActivate: [authGuard]},
            {path : 'generate-qr', component :GenerateQrComponent,canActivate: [authGuard]},
            {path :'add-employee', component :RegisterComponent,canActivate: [authGuard]},
        ]
    },
    {path : 'dashboard/employee', component :EmployeedashboardComponent,canActivate: [authGuard],
        children :[
            {path : 'my-report', component : MyReportComponent,canActivate: [authGuard]},
            {path : 'scan-qr', component :ScanQrComponent,canActivate: [authGuard]},
        ]
    },
    {path : 'logout', component : LogoutComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];

