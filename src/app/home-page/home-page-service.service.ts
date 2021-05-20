import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  constructor() { }
  
  //updating leavetype from action cell renderer
  private messageSource = new BehaviorSubject(null);
  data = this.messageSource.asObservable();
  
  leaveTypeSaved(data: any) {
    this.messageSource.next(data);
  }
}
