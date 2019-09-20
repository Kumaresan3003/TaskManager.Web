import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TaskManagerService } from '../service/task-manager.service';
import { TaskModel } from '../models/task-model';

@Component({
  templateUrl: './all-tasks.component.html',
})
export class ViewComponent implements OnInit {
    @ViewChild('showmodal') showmodal:ElementRef;
    taskDetails:TaskModel[] = [];
    public taskDetailsFiltered:TaskModel[] = [];
    
    nameSearch :string;
    parentTaskSearch:string;
    priorityFromSearch:number ;
    priorityToSearch:number;
    startDateSearch:string;
    endDateSearch:string;
    taskDetail:TaskModel;
    results:string;
    showError:boolean;
    
    constructor(
        private service: TaskManagerService,
        private router: Router, private location:Location
    ) {
    } 

    ngOnInit() {

        this.service.getAllTasks().subscribe(response => {        
            (response as TaskModel[]).forEach(element => {
                let taskDetail = (response as TaskModel[]).find(res=> res.id == element.parentTaskId);
                if(taskDetail != undefined) {
                    element.parentName = taskDetail.name;
                }
                else {     
                    element.parentName = "task has no parent";
                }
            }); 

        this.taskDetails = response;
        this.taskDetailsFiltered = response;
        this.showError = false;
    },
    error => {
        if(error.status < 200 || error.status > 300)
        {    
          this.showError = true;     
          this.results = JSON.parse(error._body);          
        }
    });    
  }

  edit(taskId) {
    this.router.navigate(['/edit'], { queryParams: { id: taskId} });
  }

  endTask(taskId) {
   
    this.taskDetail =  this.taskDetails.find(taskElement => taskElement.id == taskId);  
    this.taskDetail.endTask = true;
    this.service.updateTask(this.taskDetail, this.taskDetail.id).subscribe(response => 
    {
        if(response.length > 0) {
            this.results = this.taskDetail.name + " has been closed successfully";
        }
          
        this.openModal();
      },
      error => {
        if(error.status < 200 || error.status > 300) {
          this.taskDetail.endTask = false;
          this.results = error.statusText + "-" + JSON.parse(error._body);
          this.openModal();
        }
      }
    );
  }

  openModal() {
    this.showmodal.nativeElement.click();
  }

  closeModal() {
   // location.reload();
  }
}