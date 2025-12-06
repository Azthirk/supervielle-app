import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptService } from '../../../core/services/encrypt.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  email = '';

  constructor(
    private router: Router,
    private encryptService: EncryptService
  ) {}

  ngOnInit(): void {
    const encrypted = localStorage.getItem('user');
    if (!encrypted) return;

    const { email = '' } = this.encryptService.decrypt(encrypted) ?? {};
    this.email = email;
  }

  logout(): void {
    ['auth'].forEach(k => localStorage.removeItem(k));
    this.router.navigate(['/login']);
  }
}
