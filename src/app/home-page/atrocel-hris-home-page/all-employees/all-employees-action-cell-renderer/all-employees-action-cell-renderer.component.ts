import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { EmployeeLoginInformation } from 'src/app/model/employee.model';
import { PayrollInfo } from '../../../../model/payroll-info.model';
import { AltrocelServices } from '../../../../constant/altrocel-hris-services.service';
import { EmployeeLeaveAssigned } from "../../../../model/employee-leave-assign.model";
import { GridOptions } from 'ag-grid-community';
import { EmployeeActiveStatus } from '../../../../enums/employee-active-status.enum';
import { AllEmployeesService } from '../all-employees-service.service';

@Component({
  selector: 'app-all-employees-action-cell-renderer',
  templateUrl: './all-employees-action-cell-renderer.component.html',
  styleUrls: ['./all-employees-action-cell-renderer.component.scss']
})
export class AllEmployeesActionCellRendererComponent  implements OnInit, ICellRendererAngularComp {

  params: any;
  data:any;
  gridApi: any;
  userType: string;
  public modal: BsModalRef;

  employeeLoginRegisterForm: FormGroup;
  employeeSupervisorForm: FormGroup;
  employeePayrollInfoForm: FormGroup;
  employeeLeaveAssignForm: FormGroup;

  hasCredentials: boolean;
  allEmployees: any[] = [];
  employeeId: number;
  employeeFullName: string;
  allLeaveTypes: any[] = [];
  allLeavesAssignedToEmployee: any[] = [];
  
  leaveAssignGridApi: any;
  leaveAssignGridColumnApi: any;
  leaveAssignGridParams: any;
  leaveAssignGridOptions: GridOptions;
  
  columnDefsForLeaveAssignGrid = [
    {
      field: "leaveTypeId", headerName: "Leave Type ID", index: 1,
      width: 150, headerTooltip: 'Leave Type ID', pinned: "left",
      menuTabs: []
    },
    {
      field: "leaveType", headerName: "Leave Type", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Leave Type', pinned: "left",
    },
    {
      field: "remainingLeaveCountAnnum", headerName: "Remaining Leave Count", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Remaining Leave Count'
    }
    // {
    //   field: "actions", headerName: "actions", index: 9,
    //   width: 200, editable: false, headerTooltip: 'actions', 
    //   cellRendererFramework: AllEmployeesActionCellRendererComponent,
    //   menuTabs: [], pinned: "right"
    // }
  ];

  constructor(    
    private modalService: BsModalService,
    private toastr: ToastrService,
    private altrocelServices: AltrocelServices,
    private allEmployeesService: AllEmployeesService
  ) { }

 
  refresh(params: any): boolean {
    return false;
  }

  ngOnInit() {
    this.userType = localStorage.getItem('loggedUserType');
    
    this.employeeLoginRegisterForm = new FormGroup({
      empusern: new FormControl("", [Validators.required]),
      emppass: new FormControl("", [Validators.required]),
      repassword: new FormControl("", [Validators.required])
    });

    this.employeeSupervisorForm = new FormGroup({
      supervisorId: new FormControl("", [Validators.required])
    });

    this.employeePayrollInfoForm = new FormGroup({
      employeeIdPayrollInfoId: new FormControl(null),
      monthlyBasicSalary: new FormControl("", [Validators.required]),
      monthlyAllowance: new FormControl("", []),
      employeeEpfPercentage: new FormControl("", [Validators.required, Validators.pattern(/^[.\d]+$/)]),
      employeeEtfPercentage: new FormControl("", [Validators.required, Validators.pattern(/^[.\d]+$/)]),
      yearlyBonus: new FormControl("", []),
      employeeTravellingAllowance: new FormControl("", [])
    });

    this.employeeLeaveAssignForm = new FormGroup({
      employeeName: new FormControl(this.employeeFullName,[]),
      leaveTypeId: new FormControl("", [Validators.required]),
      leaveCount: new FormControl("", [Validators.required])
    });
  }
      
  agInit(params: any): void {      
    this.params = params;
    this.data=this.params.data;
    this.gridApi = params.api;
    this.hasCredentials = (this.data.hasCredentials === true) ? true : false;
    this.employeeId = +this.data.employeeId;
    this.employeeFullName = this.data.firstName + " " + this.data.lastName;
  }

  
  saveLoginDetails() {
    if (this.employeeLoginRegisterForm.get('emppass').value != this.employeeLoginRegisterForm.get('repassword').value) {
      this.toastr.error('Passwords donot match!', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
      return;
    }
    let employeeLoginObj: EmployeeLoginInformation = new EmployeeLoginInformation();
    employeeLoginObj.employeeId = this.data.employeeId
    employeeLoginObj.username = this.employeeLoginRegisterForm.get('empusern').value;
    employeeLoginObj.password = this.employeeLoginRegisterForm.get('emppass').value;
    this.altrocelServices.saveEmployeeLogin(employeeLoginObj).subscribe(res => {
      if (res) {
        this.toastr.success('Employee Login credentials registered!', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.closeModal();
        this.allEmployeesService.refreshGrid("REFRESH GRID");
      }
    }, error => {
      console.log(error);
      this.toastr.error('FAILED TO SAVE EMPLOYEE LOGIN DATA', 'Error!', {
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

  getAllEmployees(){
    this.altrocelServices.getAllEmployees().subscribe(res => {
      if(res){
        this.allEmployees = Object.assign(res);
        this.allEmployees.splice(this.allEmployees.indexOf(this.allEmployees.find(emp => emp.employeeId == this.employeeId)), 1);      
      }
    }, error => {
      console.log(error);
    });
  }

  saveSupervisor(){
    let supervisorId = +this.employeeSupervisorForm.get('supervisorId').value;
    this.altrocelServices.updateSupervisorForEmployee(this.employeeId, supervisorId).subscribe(res => {
      if(res && res.response == "SUCCESS"){
        this.toastr.success('Employee supervisor Updated!', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.closeModal();
        this.allEmployeesService.refreshGrid("REFRESH GRID");
      }else{
        this.toastr.error('FAILED TO update employee supervisor', 'Error!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
      }
    }, error => {
      this.toastr.error('FAILED TO SAVE employee supervisor', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  getEmployeePayrollInfo(){
    this.altrocelServices.getEmployeePayrollInfo(this.employeeId).subscribe(res => {
      if (res) {
        let employeePayrollInfo: any = Object.assign(res);
        this.employeePayrollInfoForm.get('monthlyBasicSalary').patchValue(employeePayrollInfo.monthlyBasicSalary);
        this.employeePayrollInfoForm.get('monthlyAllowance').patchValue(employeePayrollInfo.monthlyAllowance);
        this.employeePayrollInfoForm.get('employeeTravellingAllowance').patchValue(employeePayrollInfo.employeeTravellingAllowance);
        this.employeePayrollInfoForm.get('employeeEpfPercentage').patchValue(employeePayrollInfo.employeeEpfPercentage);
        this.employeePayrollInfoForm.get('employeeEtfPercentage').patchValue(employeePayrollInfo.employeeEtfPercentage);
        this.employeePayrollInfoForm.get('yearlyBonus').patchValue(employeePayrollInfo.yearlyBonus);
        this.employeePayrollInfoForm.get('employeeIdPayrollInfoId').patchValue(employeePayrollInfo.employeeIdPayrollInfoId);
      }
    }, error => {
      console.log(error);
      this.toastr.error('Failed to get employee payroll info', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  saveEmployeePayrollInfo(){
    let employeePayrollInfo: PayrollInfo = new PayrollInfo();

    employeePayrollInfo.employeeId = this.employeeId;
    employeePayrollInfo.monthlyBasicSalary = this.employeePayrollInfoForm.get('monthlyBasicSalary').value;
    employeePayrollInfo.monthlyAllowance = this.employeePayrollInfoForm.get('monthlyAllowance').value;
    employeePayrollInfo.employeeTravellingAllowance = this.employeePayrollInfoForm.get('employeeTravellingAllowance').value;
    employeePayrollInfo.employeeEpfPercentage = this.employeePayrollInfoForm.get('employeeEpfPercentage').value;
    employeePayrollInfo.employeeEtfPercentage = this.employeePayrollInfoForm.get('employeeEtfPercentage').value;
    employeePayrollInfo.yearlyBonus = this.employeePayrollInfoForm.get('yearlyBonus').value;
    employeePayrollInfo.employeeIdPayrollInfoId = this.employeePayrollInfoForm.get('employeeIdPayrollInfoId').value ? this.employeePayrollInfoForm.get('employeeIdPayrollInfoId').value : null;

    this.altrocelServices.savePayrollInfo(employeePayrollInfo).subscribe(res => {
      if (res){
        this.toastr.success('Employee Payroll Information Saved successfully!', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.closeModal();
        this.allEmployeesService.refreshGrid("REFRESH GRID");
      }
    }, error => {
      console.log(error);
    });
    
  }
  
  public inputValidator(e) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return /[\d\s]/.test(input);
  }

  getAllLeavetypes(){
    this.altrocelServices.getAllLeaveTypes().subscribe(res => {
      if(res){
        this.allLeaveTypes = Object.assign(res);
      }
    }, error => {
      console.log(error);
      this.toastr.error('Failed to get all leave types', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    })
  }
  
  gridReadyEvent(params) {
    this.leaveAssignGridApi = params.api;
    this.leaveAssignGridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.leaveAssignGridParams = params.data;
    this.leaveAssignGridApi.setRowData([]);
  }

  leaveTypeSelected(){
    let leaveTypeId = +this.employeeLeaveAssignForm.get('leaveTypeId').value;
    let leaveTypeObj =  this.allLeaveTypes.find(leaveType => leaveType.leaveTypeId == leaveTypeId);
    if(leaveTypeObj){
      this.employeeLeaveAssignForm.get('leaveCount').patchValue(leaveTypeObj.leaveCount);
    }
  }

  clearEmployeeLeaveForm(){
    this.employeeLeaveAssignForm.get('leaveTypeId').patchValue("");
    this.employeeLeaveAssignForm.get('employeeName').patchValue(this.employeeFullName);
    this.employeeLeaveAssignForm.get('leaveCount').patchValue("");
    
  }

  saveEmployeeLeaveAssign(){
    let employeeLeaveAssigned: EmployeeLeaveAssigned = new EmployeeLeaveAssigned();
    employeeLeaveAssigned.employeeId = this.employeeId;
    employeeLeaveAssigned.leaveTypeId = this.employeeLeaveAssignForm.get('leaveTypeId').value;
    employeeLeaveAssigned.remainingLeaveCountAnnum = this.employeeLeaveAssignForm.get('leaveCount').value;

    this.altrocelServices.saveEmployeeLeaveAssign(employeeLeaveAssigned).subscribe(res => {
      if(res){
        this.toastr.success('Leave Assigned successfully!', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.getAllEmployeesLeaveForGrid();
        this.clearEmployeeLeaveForm();
      }
    }, error => {
      console.log(error);
      this.toastr.error('Failed to assign leave to employee', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
    
  }

  getAllEmployeesLeaveForGrid(){
    if(this.leaveAssignGridApi){
      this.leaveAssignGridApi.showLoadingOverlay();
    }
    this.altrocelServices.getEmployeeLeaveAssigned(this.employeeId).subscribe(res => {
      if(res){
        this.allLeavesAssignedToEmployee = Object.assign(res);
        setTimeout(() => {
          this.leaveAssignGridApi.setRowData(this.allLeavesAssignedToEmployee);
        }, 500);
      }else{
        setTimeout(() => {
          this.leaveAssignGridApi.setRowData([]);
        }, 500);
      }
    }, error => {
      console.log(error);
      this.toastr.error('Failed to get all leaves assigned to employee', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  makeEmployeeInactive(){
    this.altrocelServices.makeEmployeeInactive(this.employeeId, EmployeeActiveStatus.IN_ACTIVE).subscribe(res => {
      if(res){
        this.toastr.success('Employee is now Inactive!', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.getAllEmployeesLeaveForGrid();
        this.clearEmployeeLeaveForm();
        this.closeModal();
        this.allEmployeesService.refreshGrid("REFRESH GRID");
      }
    }, error => {
      console.log(error);
      this.toastr.error('Failed to make employee inactive', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }
}
