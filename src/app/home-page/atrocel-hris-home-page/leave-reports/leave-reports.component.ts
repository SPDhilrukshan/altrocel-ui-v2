import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { ToastrService } from 'ngx-toastr';
import { AltrocelServices } from '../../../constant/altrocel-hris-services.service';
import { LeaveStatus } from '../../../enums/leave-status.enum';

@Component({
  selector: 'altrocel-leave-reports',
  templateUrl: './leave-reports.component.html',
  styleUrls: ['./leave-reports.component.scss']
})
export class LeaveReportsComponent implements OnInit {

  
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
  leaveSearchForm: FormGroup;
  leaveList: any[] = [];
  totalLeave: any = 0;
  periodDateRange: any;

  columnDefs = [
    {
      field: "employeeLeaveId", headerName: "Leave ID", index: 1,
      width: 100, headerTooltip: 'Leave ID',
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
      field: "leaveType", headerName: "Leave Type", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Leave Type'
    },
    {
      field: "leaveDate", headerName: "Leave Date/Time", index: 9,
      width: 150, editable: false, headerTooltip: 'Leave Date/Time',
      menuTabs: []
    },
    {
      field: "halfDayOrFullDay", headerName: "Half Day/Full Day", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Half Day/Full Day'
    },
    {
      field: "approvalStatus", headerName: "Approval Status", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Approval Status'
    },
    {
      field: "leaveReason", headerName: "Leave Reason", index: 9,
      width: 150, editable: false, headerTooltip: 'Leave Reason',
      menuTabs: []
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

    this.leaveSearchForm = new FormGroup({
      patientName: new FormControl("", [Validators.required]),
      leaveDaterange: new FormControl("", []),
      filterByApproved: new FormControl("", [])
    });
    
    this.leaveSearchForm.get('leaveDaterange').valueChanges.subscribe(res =>{
      if(res){
        console.log(res);
      }
    });

    this.getTodaysLeave();
  }

  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    this.gridApi.setRowData(this.rowData);
  }

  searchLeaveReport(){
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }

    let leaveStartDate: any = this.datePipe.transform(this.leaveSearchForm.get('leaveDaterange').value[0], "yyyy-MM-dd HH:mm:ss");
    let leaveEndDate: any = this.datePipe.transform(this.leaveSearchForm.get('leaveDaterange').value[1], "yyyy-MM-dd HH:mm:ss");

    this.periodDateRange = leaveStartDate + " to " + leaveEndDate;
    this.altrocelServices.getLeaveReportData(leaveStartDate,leaveEndDate).subscribe(res => {
      if(res){
        this.leaveList = Object.assign(res);
        this.calculateLeaveDaysWorked(this.leaveList);
        this.gridApi.setRowData(this.leaveList);    
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

  getTodaysLeave(){
    this.leaveSearchForm.get('leaveDaterange').patchValue('');
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    let leaveStartDate: any = this.datePipe.transform(date, "yyyy-MM-dd HH:mm:ss");
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    let leaveEndDate: any = this.datePipe.transform(date, "yyyy-MM-dd HH:mm:ss");

    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }

    this.periodDateRange = leaveStartDate + " to " + leaveEndDate;
    this.altrocelServices.getLeaveReportData(leaveStartDate,leaveEndDate).subscribe(res => {
      if(res){
        console.log(res);
        this.leaveList = Object.assign(res);
        this.calculateLeaveDaysWorked(this.leaveList);
        setTimeout(() => {
          this.gridApi.setRowData(this.leaveList); 
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
  
  calculateLeaveDaysWorked(leaveList: any[]){
    if(leaveList.length > 0){
      this.totalLeave = 0;
        leaveList.forEach(element => {
          if(element.halfDayOrFullDay == "FULL_DAY"){
            this.totalLeave++;
          } else if(element.halfDayOrFullDay == "HALF_DAY"){
            this.totalLeave += 0.5;
          }
        });
    }
  }

  filterLeaveByApproved(){
    if (this.leaveSearchForm.get('filterByApproved').value === true) {
      let filteredData: any[] = [];
      this.leaveList.forEach(element => {
        if (element.approvalStatus === LeaveStatus.APPROVED) {
          filteredData.push(element);
        }
      });
      this.calculateLeaveDaysWorked(filteredData);
      this.gridApi.setRowData(filteredData);
    } else {
      this.gridApi.setRowData(this.leaveList);
      this.calculateLeaveDaysWorked(this.leaveList);
    }
  }
}
