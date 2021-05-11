import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { EmployeeLoginInformation } from 'src/app/model/employee.model';
import { AltrocelServices } from '../../../../constant/altrocel-hris-services.service';

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

  hasCredentials: boolean;
  allEmployees: any[] = [];
  employeeId: number;

  constructor(    
    private modalService: BsModalService,
    private toastr: ToastrService,
    private altrocelServices: AltrocelServices
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
  }
      
  agInit(params: any): void {      
    this.params = params;
    this.data=this.params.data;
    this.gridApi = params.api;
    this.hasCredentials = (this.data.hasCredentials === true) ? true : false;
    this.employeeId = +this.data.employeeId;
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
      class: 'modal-xxlg ',
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

}
