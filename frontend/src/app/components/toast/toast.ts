import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ToastService, ToastMessage } from './toast-service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss']
})
export class ToastComponent implements OnInit {
  toast: ToastMessage | null = null;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toast$.subscribe((t: ToastMessage | null) => {
        return this.toast = t;
    });
  } 

  onClose(): void {
    this.toastService.clear();
  }
}
