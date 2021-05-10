import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AltrocelServices } from 'src/app/constant/altrocel-hris-services.service';
import { EmployeeLeavetype } from '../../../../app/model/leave-type.model';

@Component({
  selector: 'altrocel-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.scss']
})
export class LeaveTypeComponent implements OnInit {
  
  gridOptions: GridOptions;
  gridApi: any;
  gridParams: any;
  gridColumnApi: any;
  
  leaveTypeSearchForm: FormGroup;
  addLeavetypeForm: FormGroup;
  allLeaveType: any[] = [];
  public modal: BsModalRef;

  constructor(    
    private altrocelServices: AltrocelServices,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  columnDefs = [
    {
      field: "leaveTypeId", headerName: "Leave Type ID", index: 1,
      width: 150, headerTooltip: 'Employee ID', pinned: "left",
      menuTabs: []
    },
    {
      field: "leaveType", headerName: "Leave Type", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Leave Type', pinned: "left",
    },
    {
      field: "leaveCount", headerName: "Leave Count", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Leave Count'
    }
    // {
    //   field: "actions", headerName: "actions", index: 9,
    //   width: 200, editable: false, headerTooltip: 'actions', 
    //   // cellRendererFramework: PatientActionRendererComponent,
    //   menuTabs: [], pinned: "right"
    // }
  ];

  ngOnInit() {
    this.leaveTypeSearchForm = new FormGroup({
      leaveType: new FormControl("", [Validators.required]),
    });
    this.addLeavetypeForm = new FormGroup({
      leaveTypeName: new FormControl("", [Validators.required]),
      leaveTypeCount: new FormControl("", [Validators.required])
    });
    this.getAllLeaveTypes();
  }

  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    this.gridApi.setRowData([]);
  }

  searchLeaveType(){
    let leaveTypeSearch = this.leaveTypeSearchForm.get('leaveType').value;
    leaveTypeSearch = leaveTypeSearch.toLowerCase();
    let searchedLeaveTypes: any[] = [];
    this.allLeaveType.forEach(leaveTypeObj => {
      
      if(leaveTypeObj.leaveType.toLowerCase().includes(leaveTypeSearch)){
        searchedLeaveTypes.push(leaveTypeObj);
      }
      this.gridApi.setRowData(searchedLeaveTypes);
    });
  }
  
  cancelFormSearch() {
    this.gridApi.showLoadingOverlay();
    this.leaveTypeSearchForm.get('leaveType').patchValue("");
    this.getAllLeaveTypes();
  }

  getAllLeaveTypes(){
    this.altrocelServices.getAllLeaveTypes().subscribe(res => {
      if(res){
        this.allLeaveType = Object.assign(res);
        
        setTimeout(() => {
          this.gridApi.setRowData(this.allLeaveType);
        }, 500);
      }
    }, error => {
      console.log(error);
    })
  }

  saveLeavetype(){
    let leaveType: EmployeeLeavetype = new EmployeeLeavetype();
    leaveType.leaveType = this.addLeavetypeForm.get('leaveTypeName').value;
    leaveType.leaveCount = +this.addLeavetypeForm.get('leaveTypeCount').value;

    this.altrocelServices.saveLeaveType(leaveType).subscribe(res => {
      if(res){
        this.toastr.success('Leave type Saved Successfully', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.closeModal();
        this.cancelFormSearch();
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
