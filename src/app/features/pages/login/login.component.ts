import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { EncryptService } from '../../../core/services/encrypt.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private encrypt: EncryptService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    const saved = localStorage.getItem('user');
    if (saved) {
      const data = this.encrypt.decrypt(saved);
      this.form.patchValue({ ...data, remember: true });
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    setTimeout(() => {
      const encryptedAuth = this.encrypt.encrypt({ auth: true });
      localStorage.setItem('auth', encryptedAuth);
      this.toggleRemember();
      this.loading = false;
      this.router.navigate(['/users']);
    }, 1000);
  }

  toggleRemember(remove?: boolean): void {
    const { remember } = this.form.getRawValue();

    if (remember && !remove) {
      this.saveUser();
    } else {
      localStorage.removeItem('user');
    }
  }

  private saveUser(): void {
    const { email, password } = this.form.getRawValue();
    const encrypted = this.encrypt.encrypt({ email, password });
    localStorage.setItem('user', encrypted);
  }
}
