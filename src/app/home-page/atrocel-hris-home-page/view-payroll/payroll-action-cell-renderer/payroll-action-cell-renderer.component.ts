import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AltrocelServices } from 'src/app/constant/altrocel-hris-services.service';
import * as jspdf from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: 'app-payroll-action-cell-renderer',
  templateUrl: './payroll-action-cell-renderer.component.html',
  styleUrls: ['./payroll-action-cell-renderer.component.scss']
})
export class PayrollActionCellRendererComponent implements OnInit, ICellRendererAngularComp {

  params: any;
  data:any;
  gridApi: any;
  userType: string;
  public modal: BsModalRef;

  employeePayrollData: any;
  employeeData: any;
  
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

  epf: any;
  etf: any;salary: any; allowance: any; travlAllowance: any;
  agInit(params: any): void {      
    this.params = params;
    this.data=this.params.data;
    this.gridApi = params.api;
    this.employeePayrollData = this.data.employeePayroll;
    this.employeeData = this.data.employee;
    this.salary = Math.floor(this.employeePayrollData.empSalaryFinal*100)/100;
    this.epf = Math.floor(this.employeePayrollData.empEpfFinal*100)/100;
    this.etf = Math.floor(this.employeePayrollData.empEtfFinal*100)/100;
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

  printPdf(){
    var element = document.getElementById('payroll-sheet');

    html2canvas(element).then((canvas) => {
      console.log(canvas);

      var imgData = canvas.toDataURL('image/png');
      var doc = new jspdf.jsPDF();

      let imgHeight = canvas.height * 208 / canvas.width;
      doc.addImage(imgData, 0,0, 208, imgHeight);
      doc.save("salary.pdf");
    })
  }
}
