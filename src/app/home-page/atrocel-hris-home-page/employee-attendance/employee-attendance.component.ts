import { Component, OnInit } from '@angular/core';
// import {
//   startOfDay,
//   endOfDay,
//   subDays,
//   addDays,
//   endOfMonth,
//   isSameDay,
//   isSameMonth,
//   addHours
// } from 'date-fns';
import { Subject } from 'rxjs';
// import { NgbModal } from '@ng-bootstrap';
// import {
//   CalendarEvent,
//   CalendarEventAction,
//   CalendarEventTimesChangedEvent,
//   CalendarView
// } from 'angular-calendar';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { Attendance } from "../../../model/employee.model";
import { AltrocelServices } from '../../../constant/altrocel-hris-services.service';
import { ToastrService } from 'ngx-toastr';
import { AttendanceStatus } from '../../../enums/attendance-status.enum';
import { HomePageService } from '../../home-page-service.service';
import { AttendanceActionCellRendererComponent } from './attendance-action-cell-renderer/attendance-action-cell-renderer.component';

@Component({
  selector: 'altrocel-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {

  // view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  // CalendarView = CalendarView;
  refresh: Subject<any> = new Subject();
  // events: CalendarEvent[];
  myDate: any;
  activeDayIsOpen: boolean = true;
  
  //grid  
  gridOptions: GridOptions;
  gridApi: any;
  gridParams: any;
  gridColumnApi: any;
  gridData: any[] = [];

  addAttendanceForm: FormGroup;
  filterForm: FormGroup;
  employeeData: any;
  today: Date;
  attendanceDashboardData: any;

  //search calender date range
  range: any = "range";
  config: any = {
    viewType: "Week",
    startDate: "2017-01-05"
  }

  columnDefs = [
    {
      field: "attendanceId", headerName: "Attendance ID", index: 1,
      width: 150, headerTooltip: 'Attendance ID', pinned: "left",
      menuTabs: []
    },
    {
      field: "attendanceDate", headerName: "Entry Date/Time", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Time In', pinned: "left",
    },
    {
      field: "attendanceTimeIn", headerName: "Time In", index: 6,
      width: 100, editable: false, menuTabs: [], headerTooltip: 'Time In', pinned: "left",
    },
    {
      field: "attendanceTimeOut", headerName: "Time Out", index: 6,
      width: 100, editable: false, menuTabs: [], headerTooltip: 'Time Out'
    },
    {
      field: "hoursWorked", headerName: "Hours Worked", index: 9,
      width: 150, editable: false, headerTooltip: 'Hours Worked',
      menuTabs: []
    },
    {
      field: "attendanceStatus", headerName: "Attendance Status", index: 9,
      width: 200, editable: false, headerTooltip: 'Attendance Status',
      menuTabs: []
    }
    // {
    //   field: "actions", headerName: "actions", index: 9,
    //   width: 200, editable: false, headerTooltip: 'actions', 
    //   cellRendererFramework: AttendanceActionCellRendererComponent,
    //   menuTabs: [], pinned: "right"
    // }
  ];

  public modal: BsModalRef;
  constructor(    
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private altrocelServices: AltrocelServices,
    private toastr: ToastrService,
    private homePageServices: HomePageService
  ) { }

  ngOnInit() {
    this.today= new Date();
    this.employeeData = JSON.parse(localStorage.getItem('loggedUserData'));
    this.addAttendanceForm = new FormGroup({
      attendanceDate: new FormControl("", [Validators.required]),
      attendanceTimeIn: new FormControl("", [Validators.required]),
      attendanceTimeOut: new FormControl("", [Validators.required]),
      comments: new FormControl("", [Validators.required])
    });
    this.filterForm = new FormGroup({
      filterByApproved: new FormControl("", [Validators.required]),
      attendanceDateRange: new FormControl("", [Validators.required]),
    });
    this.getAttendanceForGrid();
    this.getAttendanceDashboardData();
  }    
  
  openModal(ModalRef: any){
    this.modal = this.modalService.show(ModalRef, {
      class: 'modal-lg ',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  
  closeModal(){
    this.modal.hide();
  }

  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    this.gridApi.setRowData([]);
  }
  
  onDateChange(newDate: Date) {
    console.log(this.datePipe.transform(newDate, "yyyy-MM-dd HH:mm:ss"));
  }

  filterAttendanceByApproved(){
    if (this.filterForm.get('filterByApproved').value === true) {
      let filteredData: any[] = [];
      this.gridData.forEach(element => {
        if (element.attendanceStatus === AttendanceStatus.REQUESTED) {
          filteredData.push(element);
        }
      });

      this.gridApi.setRowData(filteredData);
    } else {
      this.gridApi.setRowData(this.gridData);
    }
  }

  getAttendanceForGrid(){
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }
    this.gridData = [];
    this.altrocelServices.getEmployeeAttendanceByEmployeeId(this.employeeData.employeeId).subscribe(res => {
      if(res){
        this.gridData = Object.assign(res);
        
        setTimeout(() => {
          this.gridApi.setRowData(this.gridData);
        }, 500);
      }else{
        setTimeout(() => {
          this.gridApi.setRowData(this.gridData);
        }, 500);
      }
    }, error => {
      this.toastr.error('Failed to fetch Attendance', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
      setTimeout(() => {
        this.gridApi.setRowData(this.gridData);
      }, 500);
    });
  }

  saveAttendance(){
    if (this.employeeData){
      let employeeAttendance: Attendance = new Attendance();
  
      let date: string = this.addAttendanceForm.get('attendanceDate').value + "";
      date = this.datePipe.transform(date, "yyyy-MM-dd HH:mm:ss")
      
      employeeAttendance.attendanceDate = date;
      employeeAttendance.employeeId = this.employeeData.employeeId;
      employeeAttendance.attendanceTimeIn = this.addAttendanceForm.get('attendanceTimeIn').value;
      employeeAttendance.attendanceTimeOut = this.addAttendanceForm.get('attendanceTimeOut').value;
      employeeAttendance.comments = this.addAttendanceForm.get('comments').value;
      employeeAttendance.attendanceStatus = AttendanceStatus.REQUESTED;

      this.altrocelServices.saveEmployeeAttendance(employeeAttendance).subscribe(res => {
        if(res){
          this.toastr.success('Attendance Added!', 'Success!', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
          this.closeModal();
          this.addAttendanceForm.reset();
          this.filterForm.reset();
          this.getAttendanceForGrid();
          this.getAttendanceDashboardData();
        }
      }, error => {
        console.log(error);
        this.toastr.error('Failed to save Attendance', 'Error!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
      });


    }
  }

  timeSet(event){
    console.log(event + "Time shows")
  }

  searchAttendanceDateRange(){
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }
    console.log(this.filterForm.get('attendanceDateRange').value)

    let appointmentStartDate: any = this.datePipe.transform(this.filterForm.get('attendanceDateRange').value[0], "yyyy-MM-dd HH:mm:ss");
    let appointmentEndDate: any = this.datePipe.transform(this.filterForm.get('attendanceDateRange').value[1], "yyyy-MM-dd HH:mm:ss");

    this.altrocelServices.getEmployeeAttendanceByDateRange(appointmentStartDate, appointmentEndDate, this.employeeData.employeeId).subscribe(res => {
      if (res) {
        console.log(res);
        this.gridData = Object.assign(res);
        this.gridApi.setRowData(this.gridData);
      } else {
        this.gridApi.setRowData([]);
        if (this.gridApi) {
          this.gridApi.showNoRowsOverlay();
        }
      }
    });
  }

  getAttendanceDashboardData(){
    this.altrocelServices.getAttendanceDashboardData(this.employeeData.employeeId).subscribe(res => {
      if(res){
        this.attendanceDashboardData = Object.assign(res);
      }
    }, error => {
      console.log(error);
    })
  }
}
