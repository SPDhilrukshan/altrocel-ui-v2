export class Employee {
  employeeId: any;
  firstName: any;
  lastName: any;
  repassword: any;
  jobTitle: any;
  email: any;
  nic: any;
  contactNumber: any;
  gender: any;
  civilStatus: any;
  nationality: any;
  address: any;
  dateOfBirth: any;
  supervisorId: any;
  race: any;
  religion: any;
  passportNumber: any;
  drivingLicenseNumber: any;
  homeNumber: any;
  dateJoined: any;
  
  constructor() {

  }
}
export class EmployeeLoginInformation {
  employeeLoginId: any;
  employeeId: any;
  password: any;
  username: any;
}

export class Attendance{
  attendanceId: any;

  employeeId: any;
  attendanceDate: any;

  attendanceTimeIn: any;
  attendanceTimeOut: any;

  hoursWorked: any;

  attendanceStatus: any;
  comments: any;

  lastModifiedDate: any;
  createdDate: any;
}