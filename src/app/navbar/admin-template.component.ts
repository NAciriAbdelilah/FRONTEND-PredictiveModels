import {Component, OnInit, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {ActivatedRoute, Router} from "@angular/router";
import {SecurityService} from "../services/security.service";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent implements OnInit {
  @ViewChild('sidenav')
  sidenav!: MatSidenav; // Use ViewChild to access the sidenav

  constructor( public securityService : SecurityService, private observer: BreakpointObserver,
               private router: Router,
               private route : ActivatedRoute) { }

  ngOnInit(): void {
  }

  // Add a method to close the sidenav
  closeSidenav(event: Event) {
    if (this.sidenav.mode === 'over') {
      this.sidenav.close();
    }
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
