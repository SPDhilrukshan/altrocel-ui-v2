import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { AltrocelServices } from '../../constant/altrocel-hris-services.service';

@Component({
  selector: 'app-atrocel-hris-home-page',
  templateUrl: './atrocel-hris-home-page.component.html',
  styleUrls: ['./atrocel-hris-home-page.component.scss']
})
export class AbcLabsHomePageComponent implements OnInit {

  
  opened: boolean = false;
  tabName: string = "WELCOME"
  userType: string;
  userName: string;
  userData: any;

  constructor(
    private altrocelServices: AltrocelServices
    ) { }

  ngOnInit() {
    
    this.userName = localStorage.getItem('loggedUserName');
    this.getEmployeeDetailsByUsername(this.userName);
  }

  getEmployeeDetailsByUsername(username: string){
    this.altrocelServices.getEmployeeByUsername(username).subscribe(res => {
      if(res){
        localStorage.setItem("loggedUserData", JSON.stringify(res));
        this.userData = Object.assign(res);
        if(this.userData){
          this.userType = this.userData.jobTitle;
        }
      }
    })
  }

  toggleSidebar() {
    this.opened = !this.opened;
  }

  openSideBar() {
    this.opened = true;
  }

  tabClicked(tabName:string){
    this.tabName = tabName;
    this.toggleSidebar();
  }
}
