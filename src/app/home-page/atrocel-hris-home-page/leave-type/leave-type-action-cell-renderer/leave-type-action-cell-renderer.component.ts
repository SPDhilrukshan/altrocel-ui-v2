import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AltrocelServices } from '../../../../constant/altrocel-hris-services.service';
import { HomePageService } from '../../../home-page-service.service';
import { EmployeeLeavetype } from '../../../../model/leave-type.model';

@Component({
  selector: 'app-leave-type-action-cell-renderer',
  templateUrl: './leave-type-action-cell-renderer.component.html',
  styleUrls: ['./leave-type-action-cell-renderer.component.scss']
})
export class LeaveTypeActionCellRendererComponent implements OnInit, ICellRendererAngularComp {

  params: any;
  data:any;
  gridApi: any;
  userType: string;
  public modal: BsModalRef;

  leaveTypeId: any;
  
  updateLeavetypeForm: FormGroup;

  constructor(     
    private altrocelServices: AltrocelServices,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private homePageServices: HomePageService
  ) { }

  ngOnInit() {
  }

  refresh(params: any): boolean {
    return false;
  }
    
  agInit(params: any): void {      
    this.params = params;
    this.data=this.params.data;
    this.gridApi = params.api;
    this.leaveTypeId = +this.data.employeeId;
    
    this.updateLeavetypeForm = new FormGroup({
      leaveTypeName: new FormControl("", [Validators.required]),
      leaveTypeCount: new FormControl("", [Validators.required, Validators.pattern(/^[.\d]+$/)])
    });
    
  }
  
  updateleaveType(){
    let leaveType: EmployeeLeavetype = new EmployeeLeavetype();
    leaveType.leaveType = this.updateLeavetypeForm.get('leaveTypeName').value;
    leaveType.leaveCount = +this.updateLeavetypeForm.get('leaveTypeCount').value;
    leaveType.leaveTypeId = this.data.leaveTypeId;

    this.altrocelServices.saveLeaveType(leaveType).subscribe(res => {
      if(res){
        this.toastr.success('Leave type Saved Successfully', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.closeModal();
        this.homePageServices.leaveTypeSaved("SAVED");
      }
    }, error => {
      this.toastr.error('Error while saving leave type', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    })
  }

  openModal(ModalRef: any){
    
    this.updateLeavetypeForm.get('leaveTypeName').patchValue(this.data.leaveType);
    this.updateLeavetypeForm.get('leaveTypeCount').patchValue(this.data.leaveCount);

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
}
