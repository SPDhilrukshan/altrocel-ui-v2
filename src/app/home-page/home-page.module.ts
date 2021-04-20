import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'ng-sidebar';
import { HomePageRoutingModule } from './home-page-routing.module';
import { AbcLabsHomePageComponent } from './atrocel-hris-home-page/atrocel-hris-home-page.component';
// import { AbcLabsRegisterPatientsComponent } from './atrocel-hris-home-page/atrocel-hris-register-patients/atrocel-hris-register-patients.component';
import { AltrocelHRISHeaderComponent } from '../altrocel-hris-header/atrocel-hris-header.component';
import { AbcLabsFooterComponent } from '../altrocel-hris-footer/atrocel-hris-footer.component';
import { AgGridModule } from 'ag-grid-angular';
import { LandingPageComponent } from './atrocel-hris-home-page/landing-page/landing-page.component';
// import { RegisterEmployeesComponent } from './atrocel-hris-home-page/register-employees/register-employees.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { LaddaModule } from 'angular2-ladda';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {  DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { DatePipe } from '@angular/common';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
// import { DatetimePopupModule } from  'ngx-bootstrap-datetime-popup';
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { RegisterEmployeesComponent } from "../../app/home-page/atrocel-hris-home-page/register-employees/register-employees.component";

@NgModule({
  declarations: [    
    AbcLabsHomePageComponent, 
    AltrocelHRISHeaderComponent,
    AbcLabsFooterComponent,
    LandingPageComponent,
    RegisterEmployeesComponent,
  ],
  imports: [
    CommonModule,
    HomePageRoutingModule,
    SidebarModule.forRoot(),
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    ToastrModule,
    LaddaModule,
    DatepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    OwlNativeDateTimeModule,
    OwlDateTimeModule
    // DatetimePopupModule
    
    ],
  entryComponents: [
    
  ],
  providers: [
    // DatePipe
  ],
  exports:[
    RegisterEmployeesComponent
  ]
  

})
export class HomePageModule { }
