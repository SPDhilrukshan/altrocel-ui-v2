import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Constants } from './constants';
// import { Observable } from 'rxjs/Rx';

@Injectable({
    providedIn: 'root'
})
export class AltrocelServices {

    constructor(private http: HttpClient) { }

    authenticateLogin(username: string, password: string): Observable<string> {
        let obs = new Observable<string>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/authorize-login/username/" + username + "/password/" + password,{ responseType: 'text' }).subscribe(result => {
            let res = result as string;        
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });
    
        return obs;
      }

      saveEmployee(employeeObj): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.post(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER, employeeObj).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });
    
        return obs;
      } 

      getEmployeeById(employeeId: number): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/employee-id/" + employeeId).subscribe(res => {   
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }
      
      getAllEmployees(): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/all-employees").subscribe(res => {   
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      saveEmployeeLogin(emplyeeLoginInfo: any): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.post(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/save-employee-login", emplyeeLoginInfo).subscribe(res => {   
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }
      
    changeEmployeePassword(employeeId: number, newPassword: string): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.post(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/change-password/employee-id/"+ employeeId +"/new-password/" + newPassword,{}).subscribe(result => {
          let res = result;       
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });
  
      return obs;
    }

    saveEmployeeAttendance(empAttendance: any): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.post(Constants.SERVER_URL + Constants.ATTENDANCE_CONTROLLER, empAttendance).subscribe(res => {   
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });    
      return obs;
    }

    getEmployeeAttendanceByDateRange(startDate: any, endDate: any, employeeId: number): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.get(Constants.SERVER_URL + Constants.ATTENDANCE_CONTROLLER + "/date-range/start-date/" + startDate + "/end-date/"+ endDate +"/employee-id/" + employeeId).subscribe(res => {   
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });    
      return obs;
    }
    
    getEmployeeAttendanceByEmployeeId(employeeId: any): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.get(Constants.SERVER_URL + Constants.ATTENDANCE_CONTROLLER + "/employee-id/"+ employeeId).subscribe(res => {   
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });
      return obs;
    }
    
    getEmployeeAttendanceByEmployeeIdAndStatus(employeeId: any, attendanceStatus: string): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.get(Constants.SERVER_URL + Constants.ATTENDANCE_CONTROLLER + "/employee-id/"+ employeeId + "/attendance-status/" + attendanceStatus).subscribe(res => {   
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });
      return obs;
    }
    
    getEmployeeByUsername(username: string): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.get(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/employee/username/" + username).subscribe(res => {   
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });    
      return obs;
    }
      
    getAllLeaveTypes(): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.get(Constants.SERVER_URL + Constants.LEAVE_TYPE_CONTROLLER + "/all-leave-types").subscribe(res => {   
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });    
      return obs;
    }
    
    saveLeaveType(leaveTypeObj: any): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.post(Constants.SERVER_URL + Constants.LEAVE_TYPE_CONTROLLER, leaveTypeObj).subscribe(res => {            
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });
  
      return obs;
    } 
    
    updateSupervisorForEmployee(employeeId: number, supervisorId: number): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.get(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/update-supervisor/employee-id/"+ employeeId +"/supervisor-id/" + supervisorId).subscribe(res => {            
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });
  
      return obs;
    }

    savePayrollInfo(payrollInfoObj: any): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.post(Constants.SERVER_URL + Constants.PAYROLL_INFO_CONTROLLER, payrollInfoObj).subscribe(res => {            
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });
  
      return obs;
    } 

    getEmployeePayrollInfo(employeeId: number): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.get(Constants.SERVER_URL + Constants.PAYROLL_INFO_CONTROLLER + "/employee-id/" + employeeId).subscribe(res => {            
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });
  
      return obs;
    }

    saveEmployeeLeaveAssign(employeeLeaveAssign: any): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.post(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/leave-type/save", employeeLeaveAssign).subscribe(res => {            
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });
  
      return obs;
    } 

    getEmployeeLeaveAssigned(employeeId: number): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.get(Constants.SERVER_URL + Constants.LEAVE_TYPE_CONTROLLER + "/all-leave-type/employee-id/" + employeeId).subscribe(res => {            
            obs.next(res);
            obs.complete();
        }, error => {
          obs.error(error);
          console.log(error)
          obs.complete();
        });
      });
  
      return obs;
    }
}
