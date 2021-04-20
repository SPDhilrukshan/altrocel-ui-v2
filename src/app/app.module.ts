import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LaddaModule } from 'angular2-ladda';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginPageComponent } from './login-page/login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'ng-sidebar';
import { HttpClientModule } from '@angular/common/http';
import { CollapseModule } from "ngx-bootstrap/collapse";
import {ModalModule} from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { RegisterEmployeesComponent } from "../app/home-page/atrocel-hris-home-page/register-employees/register-employees.component";
// import { AltrocelHRISHeaderComponent } from './atrocel-hris-header/atrocel-hris-header.component';
import { HomePageModule } from "./home-page/home-page.module";
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    // AltrocelHRISHeaderComponent,
    // AbcLabsFooterComponent,
    // AbcLabsRegisterPatientsComponent,
    // RegisterEmployeesComponent,
    // AltrocelHRISHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LaddaModule.forRoot({
      style: "contract",
      spinnerSize: 40,
      spinnerColor: "red",
      spinnerLines: 12
    }),
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    
    SidebarModule.forRoot(),
    HttpClientModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    HomePageModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    RegisterEmployeesComponent,
    // AltrocelHRISHeaderComponent
  ]
})
export class AppModule { }
