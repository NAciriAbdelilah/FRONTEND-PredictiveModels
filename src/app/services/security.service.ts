import {Injectable, OnInit} from "@angular/core";
import {KeycloakProfile} from "keycloak-js";
import {KeycloakEventType, KeycloakService} from "keycloak-angular";



@Injectable({providedIn : "root"})
export class SecurityService implements OnInit{
  public profile? : KeycloakProfile;
  firstName: string | undefined;
  lastName: string | undefined;

  constructor (public keycloakService: KeycloakService) {
    this.init();
  }
  init(){
    this.keycloakService.keycloakEvents$.subscribe({
      next: (e) => {
        if (e.type == KeycloakEventType.OnAuthSuccess) {
          this.keycloakService.loadUserProfile().then(profile=>{
            this.profile=profile;
          });
        }
      }
    });
  }

  ngOnInit(): void {}

  getUserName(): string {
    const user = this.keycloakService.getKeycloakInstance()?.tokenParsed;
    return user?.["name"] || 'Unknown User';
  }

  getFirstName(): string {
    const user = this.keycloakService.getKeycloakInstance()?.tokenParsed;
    const fullName = user?.['name'] || 'Unknown User';
    const firstName = fullName.split(' ')[0];
    return firstName;
  }

  public hasRoleIn(roles:string[]):boolean {
    let userRoles = this.keycloakService.getUserRoles();
    for(let role of roles){
      if (userRoles.includes(role)) return true;
    } return false;
  }

  public getRole() : string {
    let role = this.keycloakService.getUserRoles();
    return role[5];
  }

  disconnect() {
    this.keycloakService.logout(window.location.origin).then((success) => {
      console.log("--> log: logout success ", success );
    }).catch((error) => {
      console.log("--> log: logout error ", error );
    });
  }

  async connect() {
    await this.keycloakService.login({
      redirectUri : window.location.origin
    }).then((success)=>{
      console.log("login success,success");
    }).catch((error)=>{
      console.log("login error ",error);
    })
  }
}
