import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllEmployeesService {

  constructor() { }
  
  //refresh grid from action cell renderer
  private messageSource = new BehaviorSubject(null);
  data = this.messageSource.asObservable();
  
  refreshGrid(data: any) {
    this.messageSource.next(data);
  }
}