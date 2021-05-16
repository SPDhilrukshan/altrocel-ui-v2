import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AltrocelServices } from '../../../constant/altrocel-hris-services.service';
import { TeamAttendanceActionCellRendererComponent } from './team-attendance-action-cell-renderer/team-attendance-action-cell-renderer.component';
import { TeamLeaveActionCellRendererComponent } from './team-leave-action-cell-renderer/team-leave-action-cell-renderer.component';
import { AttendanceStatus } from "../../../enums/attendance-status.enum";
import { LeaveStatus } from '../../../enums/leave-status.enum';

@Component({
  selector: 'altrocel-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit {

  employeeData: any;
  filterForm: FormGroup;

  selectedEmployee: any;

  //team members grid  
  gridOptions: GridOptions;
  gridApi: any;
  gridParams: any;
  gridColumnApi: any;
  gridData: any[] = [];

  //attendance grid  
  attendanceGridOptions: GridOptions;
  attendanceGridApi: any;
  attendancegridParams: any;
  attendanceGridColumnApi: any;
  attendanceGridData: any[] = [];

  //leave grid  
  leaveGridOptions: GridOptions;
  leaveGridApi: any;
  leavegridParams: any;
  leaveGridColumnApi: any;
  leaveGridData: any[] = [];

  columnDefs = [
    {
      field: "employeeId", headerName: "Employee ID", index: 1,
      width: 150, headerTooltip: 'Attendance ID', pinned: "left",
      menuTabs: []
    },
    {
      field: "fullName", headerName: "Full Name", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Time In', pinned: "left",
    }
    // {
    //   field: "actions", headerName: "actions", index: 9,
    //   width: 200, editable: false, headerTooltip: 'actions',
    //   menuTabs: [], pinned: "right",
    //   cellRendererFramework: MyTeamActionCellRendererComponent,
    // }
  ];

  attendanceColumnDefs =  [
    {
      field: "attendanceId", headerName: "Attendance ID", index: 1,
      width: 150, headerTooltip: 'Attendance ID',
      menuTabs: []
    },
    {
      field: "attendanceDate", headerName: "Entry Date/Time", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Time In',
    },
    {
      field: "attendanceTimeIn", headerName: "Time In", index: 6,
      width: 100, editable: false, menuTabs: [], headerTooltip: 'Time In',
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
    },
    {
        field: "actions", headerName: "actions", index: 9,
        width: 200, editable: false, headerTooltip: 'actions',
        menuTabs: [], pinned: "right",
        cellRendererFramework: TeamAttendanceActionCellRendererComponent,
    }
  ];

  leaveColumnDefs = [
    {
      field: "employeeLeaveId", headerName: "Leave ID", index: 1,
      width: 100, headerTooltip: 'Leave ID',
      menuTabs: []
    },
    {
      field: "leaveDate", headerName: "Leave Date/Time", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Leave Date/Time',
    },
    {
      field: "leaveType", headerName: "Leave type", index: 6,
      width: 150, editable: false, menuTabs: [], headerTooltip: 'Leave type',
    },
    {
      field: "halfDayOrFullDay", headerName: "Half Day/Full Day", index: 6,
      width: 150, editable: false, menuTabs: [], headerTooltip: 'Half Day/Full Day'
    },
    {
      field: "approvalStatus", headerName: "Approval Status", index: 9,
      width: 150, editable: false, headerTooltip: 'Approval Status',
      menuTabs: []
    },
    {
      field: "leaveReason", headerName: "Leave Reason", index: 9,
      width: 200, editable: false, headerTooltip: 'Leave Reason',
      menuTabs: []
    },
    {
        field: "actions", headerName: "actions", index: 9,
        width: 200, editable: false, headerTooltip: 'actions',
        menuTabs: [], pinned: "right",
        cellRendererFramework: TeamLeaveActionCellRendererComponent,
    }
  ];

  constructor(
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private altrocelServices: AltrocelServices,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.employeeData = JSON.parse(localStorage.getItem('loggedUserData'));
    this.filterForm = new FormGroup({
      employeeName: new FormControl("", [Validators.required])
    });
    this.getTeamMembersDataForGrid();
  }

  //team members grid
  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    this.gridApi.setRowData([]);
  }
  
  //team members grid
  attendancegridReadyEvent(params) {
    this.attendanceGridApi = params.api;
    this.attendanceGridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
    this.attendancegridParams = params.data;
    this.attendanceGridApi.setRowData([]);
  }

  //team members grid
  leaveGridReadyEvent(params) {
    this.leaveGridApi = params.api;
    this.leaveGridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
    this.leavegridParams = params.data;
    this.leaveGridApi.setRowData([]);
  }

  showLoadingOverlay() {
    if (this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }
  }

  getTeamMembersDataForGrid() {
    this.altrocelServices.getTeamMembersData(this.employeeData.employeeId).subscribe(res => {
      if (res) {
        this.gridData = Object.assign(res);

        let dataGrid: any[] = [];
        this.gridData.forEach(element => {
          let obj = {
            employeeId: element.employeeId,
            fullName: element.firstName + " " + element.lastName,
            employeeData: element
          }
          dataGrid.push(obj);
        });
        this.gridData = dataGrid;
        setTimeout(() => {
          this.gridApi.setRowData(dataGrid);
        }, 500);
      } else {
        setTimeout(() => {
          this.gridApi.setRowData([]);
        }, 500);
      }
    }, error => {
      console.log(error);
      this.toastr.error('Failed to fetch team members data', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });

    })
  }

  searchTeamMembers() {
    let employeeNameSearchString = this.filterForm.get('employeeName').value;
    if (employeeNameSearchString == "") {
      setTimeout(() => {
        this.gridApi.setRowData(this.gridData);
      }, 500);
    } else {
      employeeNameSearchString = employeeNameSearchString.toLowerCase();
      let filteredData: any[] = [];
      this.gridData.forEach(element => {
        if (element.fullName.toLowerCase().includes(employeeNameSearchString)) {
          filteredData.push(element);
        }
      });
      setTimeout(() => {
        this.gridApi.setRowData(filteredData);
      }, 500);
    }
  }

  closeSection(){
    this.selectedEmployee = null;
  }

  employeeSelected(event){
    console.log(event);
    if(event && event.data && event.data.employeeData){
      this.selectedEmployee = event.data.employeeData;
      this.getAttendanceForSelectedEmployee();
      this.getLeaveForSelectedEmployee();
    }
  }

  getAttendanceForSelectedEmployee(){
    this.altrocelServices.getEmployeeAttendanceByEmployeeIdAndStatus(this.selectedEmployee.employeeId, AttendanceStatus.REQUESTED).subscribe(res => {
      if(res){
        this.attendanceGridData = Object.assign(res);
        setTimeout(() => {
          this.attendanceGridApi.setRowData(this.attendanceGridData);
        }, 500);
      }
    }, error => {
      console.log(error);
    })
  }

  getLeaveForSelectedEmployee(){
    this.altrocelServices.getEmployeeLeaveByEmployeeIdAndStatus(this.selectedEmployee.employeeId, LeaveStatus.REQUESTED).subscribe(res => {
      if(res){
        this.leaveGridData = Object.assign(res);
        setTimeout(() => {
          this.leaveGridApi.setRowData(this.leaveGridData);
        }, 500);
      }
    }, error => {
      console.log(error);
    })
  }
}
