import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AltrocelServices } from 'src/app/constant/altrocel-hris-services.service';
import { LeaveStatus } from 'src/app/enums/leave-status.enum';

@Component({
  selector: 'app-team-leave-action-cell-renderer',
  templateUrl: './team-leave-action-cell-renderer.component.html',
  styleUrls: ['./team-leave-action-cell-renderer.component.scss']
})
export class TeamLeaveActionCellRendererComponent implements OnInit, ICellRendererAngularComp {

  
  params: any;
  data:any;
  gridApi: any;
  userType: string;
  public modal: BsModalRef;

  employeeId: number;
  employeeLeaveId: number;

  constructor(
    private modalService: BsModalService,
    private altrocelServices: AltrocelServices,
    private toastr: ToastrService
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
    this.employeeId = +this.data.employeeId;
    this.employeeLeaveId = +this.data.employeeLeaveId;
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
  
  updateLeave(updateString: string){
    let approvalStatus: string;
    if(updateString == 'APPROVE'){
      approvalStatus = LeaveStatus.APPROVED;
    }else if(updateString == 'REJECT'){
      approvalStatus = LeaveStatus.REJECTED;
    }
    this.altrocelServices.approveLeave(this.employeeLeaveId, approvalStatus).subscribe(res => {
      if(res){
        this.toastr.success('Leave '+ approvalStatus.toLowerCase() +' Successfully', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.closeModal();
      }
    }, error => {
      console.log(error);
      this.toastr.error('Failed to update leave', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

}
