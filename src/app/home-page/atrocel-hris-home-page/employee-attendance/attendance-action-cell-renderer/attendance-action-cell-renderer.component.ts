import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AttendanceStatus } from '../../../../enums/attendance-status.enum';
import { AltrocelServices } from '../../../../constant/altrocel-hris-services.service';
import { HomePageService } from '../../../home-page-service.service';

@Component({
  selector: 'app-attendance-action-cell-renderer',
  templateUrl: './attendance-action-cell-renderer.component.html',
  styleUrls: ['./attendance-action-cell-renderer.component.scss']
})
export class AttendanceActionCellRendererComponent implements OnInit, ICellRendererAngularComp {
  
  params: any;
  data:any;
  gridApi: any;
  userType: string;
  public modal: BsModalRef;
  attendanceId: any;

  attendanceStatusRequested: string = AttendanceStatus.REQUESTED;

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
    this.attendanceId = +this.data.attendanceId;       
  }
  
  deleteAttendance(){
    
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
}
