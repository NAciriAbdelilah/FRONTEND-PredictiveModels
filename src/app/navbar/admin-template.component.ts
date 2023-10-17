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
   //this.router.navigateByUrl("admin/dashboard");
  }

  async handleLogout() {
    try {
      await this.securityService.disconnect();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error", error);
    }
  }

}
