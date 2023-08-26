import { Injectable } from '@angular/core';
import {Users} from "../model/users.model";
import {UUID} from "angular2-uuid";
import {Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

    users : Users[] = [];
    authenticatedUser: Users | undefined;

  constructor() {
    this.users.push({userId : UUID.UUID(), firstname : "NACIRI",lastname : "abdelilah", email : "admin", password : "admin", roles : ["USER","ADMIN"]});
    this.users.push({userId : UUID.UUID(), firstname : "OUSSAMA", lastname : "oussama", email : "user",password : "user", roles : ["USER"]});

  }

  // Methode pour verifier l'accés du email et mot de passe

  public login(email: string, password : string): Observable<Users>{
    let users = this.users.find(u => u.email == email);
    if (!users ) return throwError( () => new Error("User not found !! "));
    if (users.password!=password){
      return throwError( () => new Error("Bad credetials !! "));
    }
    return of(users);
  }



  // Methode pour garder infos sur l'utilisateur  connecté afin de l'utiliser dans local storage

  public authenticateUser(users:Users) : Observable<boolean>{  // mode ou canal asynchrone angular
    this.authenticatedUser = users;
    localStorage.setItem("authUser", JSON.stringify(
      {username : users.email, roles: users.roles, JWT: "JWT_TOKEN"}));
    return of(true);
  }


  public hasRole(role : string) : boolean{
    return this.authenticatedUser!.roles.includes(role);

  }
  // Méthode  permet de dire si le user est connecté

  public isAuthenticated(){
    return this.authenticatedUser!=undefined;
  }

  public logout(): Observable<boolean>{
    this.authenticatedUser=undefined;
    localStorage.removeItem("authUser");
    return of(true);
  }


}
