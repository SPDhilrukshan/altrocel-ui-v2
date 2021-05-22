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
import { AllEmployeesComponent } from './atrocel-hris-home-page/all-employees/all-employees.component';
// import { CalendarModule, DateAdapter } from 'angular-calendar';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EmployeeAttendanceComponent } from './atrocel-hris-home-page/employee-attendance/employee-attendance.component';
import { LeaveTypeComponent } from './atrocel-hris-home-page/leave-type/leave-type.component';
import { AllEmployeesActionCellRendererComponent } from './atrocel-hris-home-page/all-employees/all-employees-action-cell-renderer/all-employees-action-cell-renderer.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { EmployeeLeaveComponent } from '../home-page/atrocel-hris-home-page/employee-leave/employee-leave.component';
import { MyTeamComponent } from './atrocel-hris-home-page/my-team/my-team.component';
import { TeamAttendanceActionCellRendererComponent } from './atrocel-hris-home-page/my-team/team-attendance-action-cell-renderer/team-attendance-action-cell-renderer.component';
import { TeamLeaveActionCellRendererComponent } from './atrocel-hris-home-page/my-team/team-leave-action-cell-renderer/team-leave-action-cell-renderer.component';
import { LeaveTypeActionCellRendererComponent } from './atrocel-hris-home-page/leave-type/leave-type-action-cell-renderer/leave-type-action-cell-renderer.component';
import { AttendanceActionCellRendererComponent } from './atrocel-hris-home-page/employee-attendance/attendance-action-cell-renderer/attendance-action-cell-renderer.component';
import { ViewPayrollComponent } from './atrocel-hris-home-page/view-payroll/view-payroll.component';
import { ReportComponent } from './atrocel-hris-home-page/report/report.component';
import { LeaveReportsComponent } from './atrocel-hris-home-page/leave-reports/leave-reports.component';

@NgModule({
  declarations: [    
    AbcLabsHomePageComponent, 
    AltrocelHRISHeaderComponent,
    AbcLabsFooterComponent,
    LandingPageComponent,
    RegisterEmployeesComponent,
    AllEmployeesComponent,
    EmployeeAttendanceComponent,
    LeaveTypeComponent,
    AllEmployeesActionCellRendererComponent,
    EmployeeLeaveComponent,
    MyTeamComponent,
    TeamAttendanceActionCellRendererComponent,
    TeamLeaveActionCellRendererComponent,
    LeaveTypeActionCellRendererComponent,
    AttendanceActionCellRendererComponent,
    ViewPayrollComponent,
    ReportComponent,
    LeaveReportsComponent
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
    OwlDateTimeModule,
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory,
    // }),
    NgxMaterialTimepickerModule
    // DatetimePopupModule
    
    ],
  entryComponents: [
    AllEmployeesActionCellRendererComponent,
    TeamAttendanceActionCellRendererComponent,
    TeamLeaveActionCellRendererComponent
  ],
  providers: [
    // DatePipe
  ],
  exports:[
    RegisterEmployeesComponent
  ]
  

})
export class HomePageModule { }
