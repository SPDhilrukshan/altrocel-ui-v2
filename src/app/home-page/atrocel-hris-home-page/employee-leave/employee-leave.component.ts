import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { EmployeeLeave } from '../../../model/employee-leave.model';
import { AltrocelServices } from '../../../constant/altrocel-hris-services.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LeaveStatus } from '../../../enums/leave-status.enum';

@Component({
  selector: 'altrocel-employee-leave',
  templateUrl: './employee-leave.component.html',
  styleUrls: ['./employee-leave.component.scss']
})
export class EmployeeLeaveComponent implements OnInit {

   //grid  
   gridOptions: GridOptions;
   gridApi: any;
   gridParams: any;
   gridColumnApi: any;
   gridData: any[] = [];

   columnDefs = [
     {
       field: "employeeLeaveId", headerName: "Leave ID", index: 1,
       width: 100, headerTooltip: 'Leave ID', pinned: "left",
       menuTabs: []
     },
     {
       field: "leaveDate", headerName: "Leave Date/Time", index: 6,
       width: 200, editable: false, menuTabs: [], headerTooltip: 'Leave Date/Time', pinned: "left",
     },
     {
       field: "leaveType", headerName: "Leave type", index: 6,
       width: 150, editable: false, menuTabs: [], headerTooltip: 'Leave type', pinned: "left",
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
     }
   ];

    //grid  
    employeeLeaveGridOptions: GridOptions;
    employeeLeaveGridApi: any;
    employeeLeaveGridParams: any;
    employeeLeaveGridColumnApi: any;
    employeeLeaveGridData: any[] = [];

   employeeLeaveColumnDefs = [
    {
      field: "leaveType", headerName: "Leave Type", index: 1,
      width: 200, headerTooltip: 'Leave Type', pinned: "left",
      menuTabs: []
    },
    {
      field: "leaveCount", headerName: "Leave Count", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Leave Count', pinned: "left",
    }
  ];

   employeeData: any;
   leaveTypesForEmployee: any[] = [];
   selectedLeaveType: any
   applyLeaveForm: FormGroup;

   employeeLeaveDashboardData: any;

   public modal: BsModalRef;

  constructor(      
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private altrocelServices: AltrocelServices,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.employeeData = JSON.parse(localStorage.getItem('loggedUserData'));
    this.getEmployeeLeaveDataForGrid();
    this.applyLeaveForm = new FormGroup({
      leaveTypeId: new FormControl("", [Validators.required]),
      leaveDate: new FormControl("", [Validators.required]),
      halfDayOrFullDay: new FormControl("", [Validators.required]),
      leaveReason: new FormControl("", [Validators.required])
    });
    this.getLeaveTypesAssignedForEmployee();
    this.getLeaveDashboardData();
  }
  
  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    this.gridApi.setRowData([]);
  }
   
  employeeLeaveGriReadyEvent(params) {
    this.employeeLeaveGridApi = params.api;
    this.employeeLeaveGridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.employeeLeaveGridParams = params.data;
    this.employeeLeaveGridApi.setRowData([]);
  }

  getEmployeeLeaveDataForGrid(){
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }
    this.altrocelServices.getEmployeeLeaveAppliedByEmployeeForGrid(this.employeeData.employeeId).subscribe(res => {
      if(res){
        this.gridData = Object.assign(res);
        setTimeout(() => {
          this.gridApi.setRowData(this.gridData);
        }, 500);
      }
    }, error => {
      this.toastr.error('Failed to fetch employee leaves', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
      setTimeout(() => {
        this.gridApi.setRowData(this.gridData);
      }, 500);
    })
  }

  timeSet(event){
    console.log(event + "Time shows")
  }
  
  onDateChange(newDate: Date) {
    console.log(this.datePipe.transform(newDate, "yyyy-MM-dd HH:mm:ss"));
  }

  saveEmployeeLeave(){
    let date: string = this.applyLeaveForm.get('leaveDate').value + "";
    date = this.datePipe.transform(date, "yyyy-MM-dd HH:mm:ss")
    let employeeLeave: EmployeeLeave = new EmployeeLeave();
    employeeLeave.employeeId = this.employeeData.employeeId;
    employeeLeave.leaveDate = date;
    employeeLeave.leaveReason = this.applyLeaveForm.get('leaveReason').value;
    employeeLeave.halfDayOrFullDay = this.applyLeaveForm.get('halfDayOrFullDay').value;
    employeeLeave.leaveTypeId = this.applyLeaveForm.get('leaveTypeId').value;
    employeeLeave.approvalStatus = LeaveStatus.REQUESTED;

    this.altrocelServices.applyEmployeeLeave(employeeLeave).subscribe(res => {
      if(res){
        this.toastr.success('Leave Applied Successfully', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.applyLeaveForm.reset();
        this.selectedLeaveType = null;
        this.closeModal();
        this.getEmployeeLeaveDataForGrid();
      }
    }, error => {
      console.log(error);
      this.toastr.error('Failed to save leave', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });

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

  getLeaveTypesAssignedForEmployee(){
    this.altrocelServices.getEmployeeLeaveAssigned(this.employeeData.employeeId).subscribe(res => {
      if(res){
        this.leaveTypesForEmployee = Object.assign(res);
      }
    }, error => {
      console.log(error);
      this.toastr.error('Failed to fetch Leave data', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  getLeaveTypeById(){
    let leaveTypeId: number = +this.applyLeaveForm.get('leaveTypeId').value;
    this.altrocelServices.getleaveTypeById(this.employeeData.employeeId, leaveTypeId).subscribe(res => {
      if(res){
        this.selectedLeaveType = Object.assign(res);
      }
    })
  }
  
  getLeaveDashboardData(){
    this.altrocelServices.getLeaveDashboardData(this.employeeData.employeeId).subscribe(res => {
      if(res){
        this.employeeLeaveDashboardData = Object.assign(res);
        this.employeeLeaveGridData = this.employeeLeaveDashboardData.remainingLeaveList
        setTimeout(() => {
          this.employeeLeaveGridApi.setRowData(this.employeeLeaveGridData);
        }, 500);
      }else{
        setTimeout(() => {
          this.employeeLeaveGridApi.setRowData([]);
        }, 500);
      }
    }, error => {
      console.log(error);
      this.toastr.error('Failed to fetch Leave dashboard data', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }
}
