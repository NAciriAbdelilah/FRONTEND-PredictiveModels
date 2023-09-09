import {Injectable, OnInit} from "@angular/core";
import {KeycloakProfile} from "keycloak-js";
import {KeycloakEventType, KeycloakService} from "keycloak-angular";



@Injectable({providedIn : "root"})
export class SecurityService implements OnInit{
  public profile? : KeycloakProfile;
  firstName: string | undefined;
  lastName: string | undefined;

  constructor (public kcService: KeycloakService) {
    this.init();
  }
  init(){
    this.kcService.keycloakEvents$.subscribe({
      next: (e) => {
        if (e.type == KeycloakEventType.OnAuthSuccess) {
          this.kcService.loadUserProfile().then(profile=>{
            this.profile=profile;
          });
        }
      }
    });

  }

  ngOnInit(): void {
    // Check if the user is authenticated
    if (!this.kcService.isLoggedIn()) {
      return;
    }
    const idToken = this.kcService.getKeycloakInstance().idTokenParsed;
    // @ts-ignore
    this.firstName = idToken.given_name;
    // @ts-ignore
    this.lastName = idToken.family_name;

    console.log("firstName+lastName",this.lastName,this.firstName)
    console.log("idToken",idToken)
  }


  public hasRoleIn(roles:string[]):boolean
  {
    let userRoles = this.kcService.getUserRoles();
    for(let role of roles){
      if (userRoles.includes(role)) return true;
    } return false;
  }

  public getRole() : string
  {
    let role = this.kcService.getUserRoles();
    return role[5];
  }

  disconnect()
  {
    this.kcService.logout(window.location.origin).then((success) => {
      console.log("--> log: logout success ", success );
    }).catch((error) => {
      console.log("--> log: logout error ", error );
    });
  }

  async connect()
  {
    await this.kcService.login({
      redirectUri : window.location.origin
    }).then((success)=>{
      console.log("login success,success");
    }).catch((error)=>{
      console.log("login error ",error);
    })
  }
}
