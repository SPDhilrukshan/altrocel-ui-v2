import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { ToastrService } from 'ngx-toastr';
import { AttendanceStatus } from 'src/app/enums/attendance-status.enum';
import { AltrocelServices } from '../../../constant/altrocel-hris-services.service';

@Component({
  selector: 'altrocel-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  
  gridOptions: GridOptions;
  gridApi: any;
  gridParams: any;
  gridColumnApi: any;
  range: any = "range";
  calender: any = "calender";
  userType: string;

  constructor(
    private toastr: ToastrService,
    private altrocelServices: AltrocelServices,
    private datePipe: DatePipe,
    private dateTimeAdapter: DateTimeAdapter<any>
  ) {
    dateTimeAdapter.setLocale('en-IN');
  }

  rowData: any[] = [];
  attendanceSearchForm: FormGroup;
  attendanceList: any[] = [];
  totalAttendance: any = 0;
  periodDateRange: any;

  columnDefs = [
    {
      field: "attendanceId", headerName: "Attendance ID", index: 1,
      width: 100, headerTooltip: 'Billing Number',
      menuTabs: []
    },
    {
      field: "employeeId", headerName: "Employee ID", index: 1,
      width: 100, headerTooltip: 'Employee ID',
      menuTabs: []
    },
    {
      field: "fullName", headerName: "Full Name", index: 1,
      width: 250, headerTooltip: 'Patient Name',
      menuTabs: []
    },
    {
      field: "jobTitle", headerName: "Designation", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Designation'
    },
    {
      field: "attendanceDate", headerName: "Attendance Date/Time", index: 9,
      width: 150, editable: false, headerTooltip: 'Attendance Date/Time',
      menuTabs: []
    },
    {
      field: "attendanceTimeIn", headerName: "Time In", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Time In'
    },
    {
      field: "attendanceTimeOut", headerName: "Time Out", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Time Out'
    },
    {
      field: "hoursWorked", headerName: "Hours Worked", index: 9,
      width: 150, editable: false, headerTooltip: 'Hours Worked',
      menuTabs: []
    },
    {
      field: "attendanceStatus", headerName: "Status", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Status'
    },
    {
      field: "comments", headerName: "Comments", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Comments'
    }
  ];

  ngOnInit() {
    this.userType = localStorage.getItem('loggedUserType');
    this.gridOptions = {
      pagination: true,
      rowSelection: 'single',
      enableSorting: true,
      enableColResize: true,
      paginationPageSize: 10
    };

    this.attendanceSearchForm = new FormGroup({
      patientName: new FormControl("", [Validators.required]),
      attendanceDaterange: new FormControl("", []),
      filterByApproved: new FormControl("", [])
    });
    
    this.attendanceSearchForm.get('attendanceDaterange').valueChanges.subscribe(res =>{
      if(res){
        console.log(res);
      }
    });

    this.getTodaysAttendance();
  }

  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    this.gridApi.setRowData(this.rowData);
  }

  searchAttendanceReport(){
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }

    let attendanceStartDate: any = this.datePipe.transform(this.attendanceSearchForm.get('attendanceDaterange').value[0], "yyyy-MM-dd HH:mm:ss");
    let attendanceEndDate: any = this.datePipe.transform(this.attendanceSearchForm.get('attendanceDaterange').value[1], "yyyy-MM-dd HH:mm:ss");

    this.periodDateRange = attendanceStartDate + " to " + attendanceEndDate;
    this.altrocelServices.getAttendanceReportData(attendanceStartDate,attendanceEndDate).subscribe(res => {
      if(res){
        this.attendanceList = Object.assign(res);        
        this.totalAttendance = 0; 
        this.attendanceList.forEach(element => {
          this.totalAttendance += +element.hoursWorked;
        }); 
        this.totalAttendance = this.totalAttendance / 8;
        this.gridApi.setRowData(this.attendanceList);    
      }else{
        this.gridApi.setRowData([]);
        if(this.gridApi){
          this.gridApi.showNoRowsOverlay();
        }
      }
    },error =>{
      console.log('FAILED TO LOAD BILLINGS DATA');
      console.log(error);
      this.toastr.error('FAILED TO LOAD BILLINGS DATA', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  getTodaysAttendance(){
    this.attendanceSearchForm.get('attendanceDaterange').patchValue('');
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    let attendanceStartDate: any = this.datePipe.transform(date, "yyyy-MM-dd HH:mm:ss");
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    let attendanceEndDate: any = this.datePipe.transform(date, "yyyy-MM-dd HH:mm:ss");

    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }

    this.periodDateRange = attendanceStartDate + " to " + attendanceEndDate;
    this.altrocelServices.getAttendanceReportData(attendanceStartDate,attendanceEndDate).subscribe(res => {
      if(res){
        console.log(res);
        this.attendanceList = Object.assign(res);
        this.calculateAttendanceDaysWorked(this.attendanceList);
        setTimeout(() => {
          this.gridApi.setRowData(this.attendanceList); 
        }, 500);       
      }else{
        this.gridApi.setRowData([]);
        if(this.gridApi){
          this.gridApi.showNoRowsOverlay();
        }
      }
    },error =>{
      console.log('FAILED TO LOAD BILLINGS DATA');
      console.log(error);
      this.toastr.error('FAILED TO LOAD BILLINGS DATA', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  getAllBilling(){
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }
    this.periodDateRange = "";
    // this.altrocelServices.getAllBilling().subscribe(res => {
    //   if(res){
    //     console.log(res);
    //     this.attendanceList = Object.assign(res); 
    //     this.totalAttendance = 0;
    //     this.attendanceList.forEach(element => {
    //       this.totalAttendance += +element.billedAmount;
    //       element.billedAmount = "Rs. " + element.billedAmount + "/=";
    //     });
    //     this.gridApi.setRowData(this.attendanceList);     
    //   }else{
    //     this.gridApi.setRowData([]);
    //     if(this.gridApi){
    //       this.gridApi.showNoRowsOverlay();
    //     }
    //   }
    // },error =>{
    //   console.log('FAILED TO LOAD BILLINGS DATA');
    //   console.log(error);
    //   this.toastr.error('FAILED TO LOAD BILLINGS DATA', 'Error!', {
    //     timeOut: 3000,
    //     progressBar: true,
    //     closeButton: true
    //   });
    // });
  }
  
  calculateAttendanceDaysWorked(attendanceList: any[]){
    if(attendanceList.length > 0){
      this.totalAttendance = 0;
        attendanceList.forEach(element => {
          this.totalAttendance += +element.hoursWorked;
        });
        this.totalAttendance = Math.floor((this.totalAttendance / 8)*100)/100;
    }
  }

  filterAttendanceByApproved(){
    if (this.attendanceSearchForm.get('filterByApproved').value === true) {
      let filteredData: any[] = [];
      this.attendanceList.forEach(element => {
        if (element.attendanceStatus === AttendanceStatus.APPROVED) {
          filteredData.push(element);
        }
      });
      this.calculateAttendanceDaysWorked(filteredData);
      this.gridApi.setRowData(filteredData);
    } else {
      this.gridApi.setRowData(this.attendanceList);
      this.calculateAttendanceDaysWorked(this.attendanceList);
    }
  }
}
