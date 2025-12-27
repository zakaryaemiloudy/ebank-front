import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  handleLogin() {
    if (this.loginFormGroup.invalid) return;

    const username = this.loginFormGroup.value.username;
    const password = this.loginFormGroup.value.password;

    this.authService.login(username, password).subscribe({
      next: (appUser) => {
        this.authService.authenticateUser(appUser).subscribe({
          next: (data) => {
            this.router.navigateByUrl('/customers');
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}
