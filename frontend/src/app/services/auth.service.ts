import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environment/environment';

interface LoginRequest {
  email: string;
  password: string;
}

export interface LoggedInUser {
  userId: number;
  username: string;
  email: string;
}

interface LoginResponse {
  userId: number;
  username: string;
  email: string;
  token: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // BehaviorSubject for reactive user info
  private userSubject = new BehaviorSubject<LoggedInUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user from localStorage if exists
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return new Observable<LoginResponse>((observer: any) => {
      this.http.post<LoginResponse>(`${this.apiUrl}/Auth/login`, data).subscribe({
        next: (res: any) => {
          // Set logged-in user
          const user: LoggedInUser = { userId: res.userId, username: res.username, email: res.email };
          this.setLoggedInUser(user);
          observer.next(res);
          observer.complete();
        },
        error: (err: any) => observer.error(err)
      });
    });
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/Auth/register`, data);
  }

  // ✅ Set user in service and localStorage
  setLoggedInUser(user: LoggedInUser) {
    this.userSubject.next(user);
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  // ✅ Get current user
  getLoggedInUser(): LoggedInUser | null {
    return this.userSubject.value;
  }

  // ✅ Clear user on logout
  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('loggedInUser');
  }
}
