import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  userId!: string;
  username!: string;
  fullName!: string;
  auth: any;

  roles: string[] = [];

  constructor(private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  get f() { return this.loginForm?.controls; }


  onSubmit(): void {

    this.submitted = true;

    if (this.loginForm?.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm?.value).subscribe(
      data => {
        this.tokenStorage.saveUserId(data.id);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveFullName(data.fullname);
        this.tokenStorage.saveAuthorities(data.roles);
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.roles = this.tokenStorage.getUser().roles;
        this.userId = this.tokenStorage.getUserId();
        this.router.navigate(['home']);

      },
      err => {
        this.loading = false;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }

}
