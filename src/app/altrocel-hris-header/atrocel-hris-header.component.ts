import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AltrocelServices } from '../constant/altrocel-hris-services.service';

@Component({
  selector: 'app-atrocel-hris-header',
  templateUrl: './atrocel-hris-header.component.html',
  styleUrls: ['./atrocel-hris-header.component.scss']
})
export class AltrocelHRISHeaderComponent implements OnInit {

  
  public modal: BsModalRef;
  userType: any;
  userData: any;
  userName: string;
  changePasswordForm: FormGroup;
  employeeDetails: any;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private altrocelServices: AltrocelServices
  ) { }

  @Output() menuOpenClicked = new EventEmitter();
  ngOnInit() {
    // this.userType = localStorage.getItem('loggedUserType');
    // this.userData = JSON.parse(localStorage.getItem('loggedUserData'));
    this.userName = localStorage.getItem('loggedUserName');
    this.getEmployeeDetailsByUsername(this.userName);
    this.changePasswordForm = new FormGroup({
      username: new FormControl(this.userName, [Validators.required]),
      password: new FormControl("", [Validators.required]),
      rePassword: new FormControl("", [Validators.required])
    });
  }

  changePasswordForUser(){
    let newPassword: any = this.changePasswordForm.get('password').value;
    let newRePassword: any = this.changePasswordForm.get('rePassword').value;
    if(newPassword != newRePassword){
      this.toastr.error('Passwords donot Match', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
      return;
    }
    
    this.altrocelServices.changeEmployeePassword(this.employeeDetails.employeeId,newPassword).subscribe((res: string)=> {
      if(res){
        this.toastr.success('Password Change Successful', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.closeModal();
      }
    }, error => {
      this.toastr.error('Password Change unsuccessful', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    })
  }

  getEmployeeDetailsByUsername(username: string){
    this.altrocelServices.getEmployeeByUsername(username).subscribe(res => {
      if(res){
        localStorage.setItem("loggedUserData", JSON.stringify(res));
        this.employeeDetails = Object.assign(res);
      }
    })
  }

  logoutEmployee() {
    this.removeAllLocal();
    localStorage.clear();
    this.router.navigateByUrl('login')
  }

  removeAllLocal(){
    localStorage.removeItem('loggedUserType');
    localStorage.removeItem('loggedUserName');
    localStorage.removeItem('loggedUserData');
  }
  toggleSidebar() {
    this.menuOpenClicked.emit();
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
    this.ngOnInit();
    this.modal.hide();
  }
}
