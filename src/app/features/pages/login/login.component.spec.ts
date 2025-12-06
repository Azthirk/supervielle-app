import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EncryptService } from '../../../core/services/encrypt.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

class RouterMock {
  navigate = jasmine.createSpy('navigate');
}

class EncryptMock {
  encrypt(value: any) { return 'enc_' + JSON.stringify(value); }
  decrypt(value: any) { return JSON.parse(value.replace('enc_', '')); }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockLS = (() => {
    let store: any = {};
    return {
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => store[k] = v,
      removeItem: (k: string) => delete store[k],
      clear: () => store = {}
    };
  })();

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake(mockLS.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLS.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLS.removeItem);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: EncryptService, useClass: EncryptMock },
        { provide: Router, useClass: RouterMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not login if form is invalid', () => {
    component.form.patchValue({ email: '', password: '' });
    component.login();
    expect(component.loading).toBeFalse();
  });

  it('should login and navigate when form is valid', fakeAsync(() => {
    component.form.patchValue({ email: 'a@a.com', password: '123456', remember: true });
    component.login();
    tick(1000);
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/users']);
  }));

  it('should save user when remember is true', () => {
    component.form.patchValue({ email: 'a@a.com', password: '123456', remember: true });
    component.toggleRemember();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should remove user when remember is false', () => {
    component.form.patchValue({ email: 'a@a.com', password: '123456', remember: false });
    component.toggleRemember();
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('should restore remembered user', () => {
    const saved = 'enc_' + JSON.stringify({ email: 'x@x.com', password: '123' });
    (localStorage.getItem as jasmine.Spy).and.returnValue(saved);
    component.restoreRememberedUser();
    expect(component.form.value.email).toBe('x@x.com');
    expect(component.form.value.remember).toBeTrue();
  });
});
