import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SecurityService} from "../services/security.service";

@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent implements OnInit {

  constructor( public securityService : SecurityService,
               private router: Router,
               private route : ActivatedRoute) { }

  ngOnInit(): void {
   this.router.navigateByUrl("admin/dashboard");
  }

  async handleLogout() {
    try {
      await this.securityService.disconnect();
      console.log("Logout successful");
      // You can also navigate to a different page after successful logout if needed.
    } catch (error) {
      console.error("Logout error", error);
      // Handle the error here (e.g., display an error message to the user).
    }
  }


}
