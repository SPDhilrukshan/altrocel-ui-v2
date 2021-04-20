import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'ng-sidebar';
import { HomePageRoutingModule } from './home-page-routing.module';
import { AbcLabsHomePageComponent } from './abc-labs-home-page/abc-labs-home-page.component';
// import { AbcLabsRegisterPatientsComponent } from './abc-labs-home-page/abc-labs-register-patients/abc-labs-register-patients.component';
import { AbcLabsHeaderComponent } from '../abc-labs-header/abc-labs-header.component';
import { AbcLabsFooterComponent } from '../abc-labs-footer/abc-labs-footer.component';
import { AgGridModule } from 'ag-grid-angular';
import { LandingPageComponent } from './abc-labs-home-page/landing-page/landing-page.component';
// import { RegisterEmployeesComponent } from './abc-labs-home-page/register-employees/register-employees.component';
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
import { RegisterEmployeesComponent } from "../../app/home-page/abc-labs-home-page/register-employees/register-employees.component";

@NgModule({
  declarations: [    
    AbcLabsHomePageComponent, 
    AbcLabsHeaderComponent,
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
