import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import {Observable} from "rxjs";
import {KeycloakService} from "keycloak-angular";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor( private keycloakService: KeycloakService ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Retrieve the access token from Keycloak
    const accessToken = this.keycloakService.getKeycloakInstance()?.token;
    console.log(":::My access Token::::",accessToken)

    // Clone the request and add the token to the Authorization header
    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(request);
  }
}
