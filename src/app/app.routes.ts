import { Routes } from '@angular/router';
import { LoginComponent } from './features/pages/login/login.component'; 
import { UsersComponent } from './features/pages/users/users.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: 'login' }
];
