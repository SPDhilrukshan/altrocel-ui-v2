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

      
      updateEmployee(employeeObj): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.post(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/update/", employeeObj).subscribe(res => {            
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
      
    changeEmployeePassword(employeeId: number, newPassword: string): Observable<string> {
      let obs = new Observable<string>(obs => {
        this.http.put(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/change-password/employee-id/"+ employeeId +"/new-password/" + newPassword,{ responseType: 'text' }).subscribe(result => {
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

    getEmployeeAttendanceByDateRange(startDate: any, endDate: any): Observable<any> {
      let obs = new Observable<any>(obs => {
        this.http.get(Constants.SERVER_URL + Constants.ATTENDANCE_CONTROLLER + "/date-range/start-date/"+ startDate +"/end-date/" + endDate).subscribe(res => {   
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
}
