import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AppUser } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  users: AppUser[] = [];
  authenticatedUser: AppUser | undefined;

  constructor(private http: HttpClient) {
    // Initialize with a default user for demonstration
    this.users.push({
      userId: crypto.randomUUID(),
      username: 'user',
      password: '123',
      roles: ['USER']
    });
    this.users.push({
      userId: crypto.randomUUID(),
      username: 'admin',
      password: '123',
      roles: ['USER', 'ADMIN']
    });
  }

  public login(username: string, password: string): Observable<AppUser> {
    const appUser = this.users.find(u => u.username === username);
    if (!appUser || appUser.password !== password) {
      return throwError(() => new Error('Invalid username or password'));
    }
    return of(appUser);
  }

  public authenticateUser(appUser: AppUser): Observable<boolean> {
    this.authenticatedUser = appUser;
    localStorage.setItem('authUser', JSON.stringify({
      username: appUser.username,
      roles: appUser.roles,
      jwt: 'JWT_TOKEN' // In a real app, you would generate a real JWT
    }));
    return of(true);
  }

  public hasRole(role: string): boolean {
    return this.authenticatedUser?.roles.includes(role) ?? false;
  }

  public isAuthenticated(): boolean {
    return this.authenticatedUser !== undefined;
  }

  public logout(): Observable<boolean> {
    this.authenticatedUser = undefined;
    localStorage.removeItem('authUser');
    return of(true);
  }
}
