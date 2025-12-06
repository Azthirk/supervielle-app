import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptService } from '../../../core/services/encrypt.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  email = '';

  constructor(
    private router: Router,
    private encrypt: EncryptService
  ) {
    this.email = this.getEmail();
  }

  private getEmail(): string {
    try {
      const encrypted = localStorage.getItem('user');
      return encrypted ? (this.encrypt.decrypt(encrypted)?.email ?? '') : '';
    } catch {
      return '';
    }
  }

  logout(): void {
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }
}