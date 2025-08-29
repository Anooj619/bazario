import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  message: string;
  actionText?: string;
  action?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  toast$ = this.toastSubject.asObservable();

  show(message: string, durationMs: number = 4000) {
    this.toastSubject.next({ message});
    // Auto-dismiss
    setTimeout(() => this.clear(), durationMs);
  }

  clear() {
    this.toastSubject.next(null);
  }
}
