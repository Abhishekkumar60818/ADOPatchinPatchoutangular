import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
        return false;
      }

      const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      // ✅ Allow access to admin routes only for Admin
      if (state.url.startsWith('/dashboard/admin')) {
        if (userRole === 'Admin') return true;
        router.navigate(['/unauthorized']); // or fallback page
        return false;
      }

      if(state.url.startsWith('dashboard/admin/add-employee')){
        if(userRole === 'Admin') return true;
        router.navigate(['/unauthorized']); // or fallback page
        return false;
      }
      

      // ✅ Allow access to employee routes only for Employee
      if (state.url.startsWith('/dashboard/employee')) {
        if (userRole === 'Employee') return true;
        router.navigate(['/unauthorized']); // or fallback page
        return false;
      }

      // ✅ If route doesn’t match any protected route patterns, allow access
      return true;

    } catch (e) {
      localStorage.removeItem('token');
      router.navigate(['/login']);
      return false;
    }
  }

  router.navigate(['/login']);
  return false;
};
