import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forms',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './forms.html',
  styleUrl: './forms.scss',
})
export class Forms {
  reactiveForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.reactiveForm = this.fb.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.reactiveForm.valid) {
      const name = this.reactiveForm.get('name')?.value;
      const password = this.reactiveForm.get('password')?.value;

      if (this.authService.login(name, password)) {
        alert('✅ Login effettuato! Benvenuto Admin.');
        this.router.navigate(['/home']);
      } else {
        alert('❌ Credenziali errate. Riprova.');
      }
    }
  }

  onReset() {
    this.reactiveForm.reset();
  }
}
