import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions, SetLeftFeature } from 'ag-grid-community';
import { AltrocelServices } from "../../../constant/altrocel-hris-services.service";
import { AllEmployeesActionCellRendererComponent } from './all-employees-action-cell-renderer/all-employees-action-cell-renderer.component';
import { AllEmployeesService } from './all-employees-service.service';

@Component({
  selector: 'altrocel-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.scss']
})
export class AllEmployeesComponent implements OnInit {

  gridOptions: GridOptions;
  gridApi: any;
  gridParams: any;
  gridColumnApi: any;
  
  employeeSearchForm: FormGroup;
  allEmployees: any[] = [];

  columnDefs = [
    {
      field: "employeeId", headerName: "Employee ID", index: 1,
      width: 150, headerTooltip: 'Employee ID', pinned: "left",
      menuTabs: []
    },
    {
      field: "firstName", headerName: "First Name", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'First Name', pinned: "left",
    },
    {
      field: "lastName", headerName: "Last Name", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Last Name'
    },
    {
      field: "nic", headerName: "NIC", index: 9,
      width: 200, editable: false, headerTooltip: 'NIC',
      menuTabs: []
    },
    {
      field: "passportNumber", headerName: "Passport Number", index: 9,
      width: 200, editable: false, headerTooltip: 'Passport Number',
      menuTabs: []
    },
    {
      field: "drivingLicenseNumber", headerName: "Driving License Number", index: 9,
      width: 200, editable: false, headerTooltip: 'Driving License Number',
      menuTabs: []
    },
    {
      field: "dateOfBirth", headerName: "Date Of Birth", index: 7,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Date Of Birth'
    },
    {
      field: "dateJoined", headerName: "Date Joined", index: 7,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Date Joined'
    },
    {
      field: "contactNumber", headerName: "Contact Number", index: 9,
      width: 200, editable: false, headerTooltip: 'Contact Number',
      menuTabs: []
    },
    {
      field: "gender", headerName: "Gender", index: 9,
      width: 200, editable: false, headerTooltip: 'Gender',
      menuTabs: []
    },
    {
      field: "civilStatus", headerName: "Marital Status", index: 9,
      width: 200, editable: false, headerTooltip: 'Marital Status',
      menuTabs: []
    },
    {
      field: "nationality", headerName: "Nationality", index: 9,
      width: 200, editable: false, headerTooltip: 'Nationality',
      menuTabs: []
    },
    {
      field: "jobTitle", headerName: "Job Title", index: 9,
      width: 200, editable: false, headerTooltip: 'Job Title',
      menuTabs: []
    },
    {
      field: "activeStatus", headerName: "Active Status", index: 9,
      width: 200, editable: false, headerTooltip: 'Active Status',
      menuTabs: []
    },
    {
      field: "actions", headerName: "actions", index: 9,
      width: 200, editable: false, headerTooltip: 'actions', 
      cellRendererFramework: AllEmployeesActionCellRendererComponent,
      menuTabs: [], pinned: "right"
    }
  ];

  constructor(
    private altrocelServices: AltrocelServices,
    private allEmployeesService: AllEmployeesService
  ) { }

  ngOnInit() {
    this.gridOptions = {
      pagination: true,
      rowSelection: 'single',
      enableSorting: true,
      enableColResize: true,
      paginationPageSize: 10
    };

    this.employeeSearchForm = new FormGroup({
      employeeName: new FormControl("", [Validators.required]),
    });

    this.getAllEmployees();
    this.allEmployeesService.data.subscribe(res => {
      if(res != null){
        this.getAllEmployees();
        this.allEmployeesService.refreshGrid(null);
      }
    })
  }
  
  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    this.gridApi.setRowData([]);
  }

  searchEmployee(){
    let empSearchName = this.employeeSearchForm.get('employeeName').value;
    empSearchName = empSearchName.toLowerCase();
    let searchedEmployees: any[] = [];
    this.allEmployees.forEach(employee => {
      let empFullName: string = employee.firstName + " " + employee.lastName
      empFullName = empFullName.toLowerCase();

      if(empFullName.includes(empSearchName)){
        searchedEmployees.push(employee);
      }
      this.gridApi.setRowData(searchedEmployees);
    });
    
  }

  cancelFormSearchEmployee() {
    this.gridApi.showLoadingOverlay();
    this.employeeSearchForm.get('employeeName').patchValue("");
    this.getAllEmployees();
  }

  getAllEmployees(){
    this.altrocelServices.getAllEmployees().subscribe(res => {
      if(res){
        this.allEmployees = Object.assign(res);
        
        setTimeout(() => {
          this.gridApi.setRowData(this.allEmployees);
        }, 500);
        
      }
    }, error => {
      console.log(error);
    });
  }
}
