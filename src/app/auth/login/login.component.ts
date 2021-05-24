import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {Router} from '@angular/router';
import {LoginDto} from '../shared/dtos/login.dto';
import {environment} from '../../../environments/environment';
import {ClearError} from '../../collections/state/collections.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  errormessage: string | undefined;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    //  Initialize the form group
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authService.logout();
  }

  // Getters for easy access to form fields
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const loginDto: LoginDto = {email: this.email.value, password: this.password.value};
    this.authService.login(loginDto)
      .subscribe(
        success => {
          this.router.navigate(['/collections']);
        },
        error => {
          this.errormessage = error.message;
          this.loading = false;
        });
  }
  clearError(): void {
    this.errormessage = undefined;

  }

}
