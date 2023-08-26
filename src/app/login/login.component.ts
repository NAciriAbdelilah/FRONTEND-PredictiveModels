import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userFormGroup! : FormGroup;
  errorMessage! : any;


  // pour injecter le SERVICE  d'authentification on doit ajouter au constructeur le service AuthenticationService
  // le service Routage est : router pour naviger vers la route Predectives models
  constructor( private fb : FormBuilder,
               private authService : AuthenticationService,
               private router : Router) { }

  ngOnInit(): void {
    this.userFormGroup = this.fb.group({
      email : this.fb.control(""),
      password : this.fb.control(""),
    });
  }

  handleLogin() {
    let email = this.userFormGroup.value.email;
    let password = this.userFormGroup.value.password;
    this.authService.login(email,password).subscribe({
      next : (appUser)=>{
          this.authService.authenticateUser(appUser).subscribe({
            next : (data)=>{
              this.router.navigateByUrl("/admin");
            },
          });
      },
      error : (err)=>{
        this.errorMessage = err;
      }
    });
  }
}
