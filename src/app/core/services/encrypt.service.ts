import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EncryptService {

  encrypt(data: any): string {
    return btoa(JSON.stringify(data));
  }

  decrypt(value: string): any {
    return JSON.parse(atob(value));
  }
}
