import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private adminSubject = new BehaviorSubject<boolean>(false);

  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'admin123';

  constructor() {
    // Recupero stato da localStorage
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('isAdmin') === 'true';
      this.adminSubject.next(saved);
    }
  }

  // Observable che notifica lo stato admin
  adminStatus$ = this.adminSubject.asObservable();

  login(username: string, password: string): boolean {
    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('isAdmin', 'true');
      }
      this.adminSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('isAdmin');
    }
    this.adminSubject.next(false);
  }

  isAdmin(): boolean {
    return this.adminSubject.getValue();
  }
}
