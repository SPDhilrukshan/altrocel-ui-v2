import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AttendanceStatus } from '../../../../enums/attendance-status.enum';
import { AltrocelServices } from '../../../../constant/altrocel-hris-services.service';

@Component({
  selector: 'app-team-attendance-action-cell-renderer',
  templateUrl: './team-attendance-action-cell-renderer.component.html',
  styleUrls: ['./team-attendance-action-cell-renderer.component.scss']
})
export class TeamAttendanceActionCellRendererComponent implements OnInit, ICellRendererAngularComp {

  params: any;
  data:any;
  gridApi: any;
  userType: string;
  public modal: BsModalRef;

  employeeId: number;
  attendanceId: number;
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
    this.attendanceId = +this.data.attendanceId;
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

  updateAttendance(updateString: string){
    let approvalStatus: string;
    if(updateString == 'APPROVE'){
      approvalStatus = AttendanceStatus.APPROVED;
    }else if(updateString == 'REJECT'){
      approvalStatus = AttendanceStatus.REJECTED;
    }
    this.altrocelServices.approveAttendance(this.attendanceId, approvalStatus).subscribe(res => {
      if(res){
        this.toastr.success('Attendance '+ approvalStatus.toLowerCase() +' Successfully', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.closeModal();
      }
    }, error => {
      console.log(error);
      this.toastr.error('Failed to update attendance', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }
}
