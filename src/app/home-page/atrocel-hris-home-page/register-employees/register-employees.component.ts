import { Component, EventEmitter, forwardRef, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Employee, EmployeeLoginInformation } from '../../../model/employee.model';
import { AltrocelServices } from '../../../constant/altrocel-hris-services.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'altrocel-register-employees',
  templateUrl: './register-employees.component.html',
  styleUrls: ['./register-employees.component.scss']
})
export class RegisterEmployeesComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private altrocelServices: AltrocelServices,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef 
    // @Inject(forwardRef(() => AllEmployeesComponent )) private allEmployeesComponent : AllEmployeesComponent 
  ) { }

  employeeRegisterForm: FormGroup;
  employeeLoginRegisterForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  myDateValue: Date;
  saveBtnText: string = "Register";
  employeeSavedObj: any; 
  public modal: BsModalRef;

  @Input() Data: any;
  @Output() closeEditModal = new EventEmitter();

  @ViewChild('SaveEmployeeLoginModal',{static: true}) SaveEmployeeLoginModal: any;

  ngOnInit() {
    this.myDateValue = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue' });
    this.employeeRegisterForm = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      jobTitle: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      nic: new FormControl("", [Validators.required]),
      contactNumber: new FormControl("", [Validators.required]),
      homeNumber: new FormControl("", []),
      passportNumber: new FormControl("", []),
      gender: new FormControl("", [Validators.required]),
      civilStatus: new FormControl("", []),
      nationality: new FormControl("", []),
      address: new FormControl("", []),
      dateOfBirth: new FormControl("", [Validators.required]),
      race: new FormControl("", []),
      religion: new FormControl("", []),
      drivingLicenseNumber: new FormControl("", []),
      dateJoined: new FormControl("", [])
    });

    this.employeeLoginRegisterForm = new FormGroup({
      empusern: new FormControl("", [Validators.required]),
      emppass: new FormControl("", [Validators.required]),
      repassword: new FormControl("", [Validators.required])
    });


    if (this.Data) {
      this.employeeRegisterForm.get('firstName').patchValue(this.Data.firstName);
      this.employeeRegisterForm.get('lastName').patchValue(this.Data.lastName);
      this.employeeRegisterForm.get('jobTitle').patchValue(this.Data.jobTitle);
      this.employeeRegisterForm.get('email').patchValue(this.Data.email);
      this.employeeRegisterForm.get('nic').patchValue(this.Data.nic);
      this.employeeRegisterForm.get('contactNumber').patchValue(this.Data.contactNumber);
      this.employeeRegisterForm.get('homeNumber').patchValue(this.Data.homeNumber);
      this.employeeRegisterForm.get('gender').patchValue(this.Data.gender);
      this.employeeRegisterForm.get('civilStatus').patchValue(this.Data.civilStatus);
      this.employeeRegisterForm.get('nationality').patchValue(this.Data.nationality);
      this.employeeRegisterForm.get('address').patchValue(this.Data.address);
      this.employeeRegisterForm.get('dateOfBirth').patchValue(this.datePipe.transform(this.Data.dateOfBirth, "yyyy-MM-dd"));
      this.employeeRegisterForm.get('dateJoined').patchValue(this.datePipe.transform(this.Data.dateJoined, "yyyy-MM-dd"));
      this.employeeRegisterForm.get('passportNumber').patchValue(this.Data.passportNumber);
      this.employeeRegisterForm.get('race').patchValue(this.Data.race);
      this.employeeRegisterForm.get('religion').patchValue(this.Data.religion);
      this.employeeRegisterForm.get('jobTitle').disable();
      this.employeeRegisterForm.get('dateJoined').disable();
      this.saveBtnText = 'Update';
    } else {
      this.saveBtnText = 'Register';
    }
  }

  saveEmployee() {
    let employeeSaveObj: Employee = new Employee();

    if (!this.emailValidator(this.employeeRegisterForm.get('email').value)) {
      this.toastr.error('Please enter a valid email address', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
      return;
    }

    let dob: string = this.employeeRegisterForm.get('dateOfBirth').value + "";
    dob = this.datePipe.transform(dob, "yyyy-MM-dd HH:mm:ss")

    let dateJoined: string = this.employeeRegisterForm.get('dateJoined').value + "";
    dateJoined = this.datePipe.transform(dateJoined, "yyyy-MM-dd HH:mm:ss")

    if (this.Data) {
      employeeSaveObj.employeeId = this.Data.employeeId;
      employeeSaveObj.firstName = this.employeeRegisterForm.get('firstName').value;
      employeeSaveObj.lastName = this.employeeRegisterForm.get('lastName').value;
      employeeSaveObj.jobTitle = this.employeeRegisterForm.get('jobTitle').value;
      employeeSaveObj.email = this.employeeRegisterForm.get('email').value;
      employeeSaveObj.nic = this.employeeRegisterForm.get('nic').value;
      employeeSaveObj.contactNumber = this.employeeRegisterForm.get('contactNumber').value;
      employeeSaveObj.gender = this.employeeRegisterForm.get('gender').value;
      employeeSaveObj.civilStatus = this.employeeRegisterForm.get('civilStatus').value;
      employeeSaveObj.nationality = this.employeeRegisterForm.get('nationality').value;
      employeeSaveObj.address = this.employeeRegisterForm.get('address').value;
      employeeSaveObj.race = this.employeeRegisterForm.get('race').value;
      employeeSaveObj.religion = this.employeeRegisterForm.get('religion').value;
      employeeSaveObj.passportNumber = this.employeeRegisterForm.get('passportNumber').value;
      employeeSaveObj.dateJoined = dateJoined;
      employeeSaveObj.dateOfBirth = dob;
      //add extra fields for update

      this.altrocelServices.saveEmployee(employeeSaveObj).subscribe(res => {

        if (res) {
          this.toastr.success('Employee updated!', 'Success!', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
          // this.allEmployeesComponent.ngOnInit();
          this.closeEditModal.emit();
        }
      }, error => {
        console.log('FAILED TO UPDATE EMPLOYEE DATA');
        console.log(error);
        this.toastr.error('FAILED TO UPDATE EMPLOYEE DATA', 'Error!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
      });

    } else {
      employeeSaveObj.firstName = this.employeeRegisterForm.get('firstName').value;
      employeeSaveObj.lastName = this.employeeRegisterForm.get('lastName').value;
      employeeSaveObj.jobTitle = this.employeeRegisterForm.get('jobTitle').value;
      employeeSaveObj.email = this.employeeRegisterForm.get('email').value;
      employeeSaveObj.nic = this.employeeRegisterForm.get('nic').value;
      employeeSaveObj.contactNumber = this.employeeRegisterForm.get('contactNumber').value;
      employeeSaveObj.gender = this.employeeRegisterForm.get('gender').value;
      employeeSaveObj.civilStatus = this.employeeRegisterForm.get('civilStatus').value;
      employeeSaveObj.nationality = this.employeeRegisterForm.get('nationality').value;
      employeeSaveObj.address = this.employeeRegisterForm.get('address').value;
      employeeSaveObj.race = this.employeeRegisterForm.get('race').value;
      employeeSaveObj.religion = this.employeeRegisterForm.get('religion').value;
      employeeSaveObj.passportNumber = this.employeeRegisterForm.get('passportNumber').value;
      employeeSaveObj.dateJoined = dateJoined;
      employeeSaveObj.dateOfBirth = dob;

      this.altrocelServices.saveEmployee(employeeSaveObj).subscribe(res => {
        if (res) {
          this.employeeSavedObj = Object.assign(res);
          this.toastr.success('Employee registered!', 'Success!', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
          this.employeeRegisterForm.reset();
          this.openModal(this.SaveEmployeeLoginModal);
        }
      }, error => {
        console.log('FAILED TO SAVE EMPLOYEE DATA');
        console.log(error);
        this.toastr.error('FAILED TO SAVE EMPLOYEE DATA', 'Error!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
      });
    }
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
    employeeLoginObj.employeeId = this.employeeSavedObj.employeeId
    employeeLoginObj.username = this.employeeLoginRegisterForm.get('empusern').value;
    employeeLoginObj.password = this.employeeLoginRegisterForm.get('emppass').value;
    this.altrocelServices.saveEmployeeLogin(employeeLoginObj).subscribe(res => {
      if (res) {
        this.toastr.success('Employee Login credentials registered!', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.employeeLoginRegisterForm.reset();
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

  //return true if validated ok
  passwordValidation(): boolean {
    let password: string = this.employeeRegisterForm.get('emppass').value;
    let repassword = this.employeeRegisterForm.get('repassword').value;

    if (password.length > 8 && password.length < 13) {
      return true
    }
    return false;
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

  cancelFormEmployee() {
    this.employeeRegisterForm.reset()
  }

  emailValidator(input): boolean {
    return /[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/.test(input);
  }

  onDateChange(newDate: Date) {
    console.log(this.datePipe.transform(newDate, "yyyy-MM-dd HH:mm:ss"));
  }

  closeModalv2(){    
    // this.AFTER_SAVE_PROTOCOL.emit();
    this.bsModalRef.hide();
  }
}
