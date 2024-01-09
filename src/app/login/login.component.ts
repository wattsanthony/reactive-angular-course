import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


import {Router} from '@angular/router';
import { AuthStore } from '../services/auth.store';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthStore) {

    this.form = fb.group({
      email: ['test@angular-university.io', [Validators.required]],
      password: ['test', [Validators.required]]
    });

  }

  // Login function
  login() {

    // Get form values
    const val = this.form.value;

    // Send to login service
    this.auth.login(val.email, val.password)
    .subscribe(
      () => {
        this.router.navigateByUrl("/courses")
      },
      err => {
        alert("Login failed!");
      }
    );

  }

}
