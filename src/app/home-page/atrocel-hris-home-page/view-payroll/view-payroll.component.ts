import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AltrocelServices } from 'src/app/constant/altrocel-hris-services.service';
import { PayrollActionCellRendererComponent } from './payroll-action-cell-renderer/payroll-action-cell-renderer.component';

@Component({
  selector: 'altrocel-view-payroll',
  templateUrl: './view-payroll.component.html',
  styleUrls: ['./view-payroll.component.scss']
})
export class ViewPayrollComponent implements OnInit {

   //grid  
   gridOptions: GridOptions;
   gridApi: any;
   gridParams: any;
   gridColumnApi: any;
   gridData: any[] = [];

   columnDefs = [
     {
       field: "employeePayrollId", headerName: "Payroll ID", index: 1,
       width: 100, headerTooltip: 'Payroll ID', pinned: "left",
       menuTabs: []
     },
     {
       field: "calculatedDate", headerName: "Calculated Date/Time", index: 6,
       width: 200, editable: false, menuTabs: [], headerTooltip: 'Calculated Date/Time', pinned: "left",
     },
     {
       field: "salaryDate", headerName: "Salary Month", index: 6,
       width: 150, editable: false, menuTabs: [], headerTooltip: 'Salary Month', pinned: "left",
     },
     {
       field: "actions", headerName: "actions", index: 9,
       width: 100, editable: false, headerTooltip: 'actions', 
       cellRendererFramework: PayrollActionCellRendererComponent,
       menuTabs: [], pinned: "right"
     }
   ];

    //grid  
    employeePayrollInfoGridOptions: GridOptions;
    employeePayrollInfoGridApi: any;
    employeePayrollInfoGridParams: any;
    employeePayrollInfoGridColumnApi: any;
    employeePayrollInfoGridData: any[] = [];

   employeePayrollInfoColumnDefs = [
     {
       field: "id", headerName: "Item", index: 1,
       width: 200, headerTooltip: 'Item', pinned: "left", hide: true,
       menuTabs: []
     },
    {
      field: "item", headerName: "Item", index: 1,
      width: 200, headerTooltip: 'Item', pinned: "left",
      menuTabs: []
    },
    {
      field: "value", headerName: "Value", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Value', pinned: "left",
    }
  ];

   employeeData: any;
   leaveTypesForEmployee: any[] = [];
   selectedLeaveType: any
   applyLeaveForm: FormGroup;

   employeePayrollDashboardData: any;

   public modal: BsModalRef;

  constructor(      
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private altrocelServices: AltrocelServices,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.employeeData = JSON.parse(localStorage.getItem('loggedUserData'));
    this.getEmployeePayrollDataForGrid();
    this.applyLeaveForm = new FormGroup({
      leaveTypeId: new FormControl("", [Validators.required]),
      leaveDate: new FormControl("", [Validators.required]),
      halfDayOrFullDay: new FormControl("", [Validators.required]),
      leaveReason: new FormControl("", [Validators.required])
    });
    this.getPayrollDashboardData();
  }
  
  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    // this.gridApi.setRowData([]);
  }
   
  employeePayrollInfoGriReadyEvent(params) {
    this.employeePayrollInfoGridApi = params.api;
    this.employeePayrollInfoGridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.employeePayrollInfoGridParams = params.data;
    // this.employeePayrollInfoGridApi.setRowData([]);
  }

  getEmployeePayrollDataForGrid(){
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }
    this.altrocelServices.getPayrollDataByEmployeeId(this.employeeData.employeeId).subscribe(res => {
      if(res){
        this.gridData = Object.assign(res);
        setTimeout(() => {
          this.gridApi.setRowData(this.gridData);
        }, 500);
      }
    }, error => {
      this.toastr.error('Failed to fetch employee payroll', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
      setTimeout(() => {
        this.gridApi.setRowData(this.gridData);
      }, 500);
    })
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
  
  getPayrollDashboardData(){
    this.altrocelServices.getDashboardDataByEmployeeId(this.employeeData.employeeId).subscribe(res => {
      if(res){
        this.employeePayrollDashboardData = Object.assign(res);
        let gridData: any[] = [];
        this.employeePayrollDashboardData.forEach(element => {
          let obj = {
            item: element.item,
            value: element.value
          }
          gridData.push(obj);
        });
        this.employeePayrollDashboardData = gridData;
        setTimeout(() => {
          this.employeePayrollInfoGridApi.setRowData(gridData);
        }, 500);
      }else{
        setTimeout(() => {
          this.employeePayrollInfoGridApi.setRowData([]);
        }, 500);
      }
    }, error => {
      console.log(error);
      this.toastr.error('Failed to fetch dashboard data', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

}
