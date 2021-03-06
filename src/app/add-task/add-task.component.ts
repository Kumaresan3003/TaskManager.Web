import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { TaskManagerService } from '../service/task-manager.service';
import { TaskModel } from '../models/task-model';

@Component({
  templateUrl: './add-task.component.html'
})
export class AddComponent implements OnInit {

  @ViewChild('showmodal') showmodal:ElementRef;
  taskDetails:TaskModel[]
  public taskDetail:TaskModel;
  results:string

  constructor(
    private taskManagerService: TaskManagerService,
    private router: Router
  ) { 
   this.taskDetail = new TaskModel();
   this.taskDetail.priority = 0;
  }

  ngOnInit() {
    this.taskManagerService.getAllTasks().subscribe(
      p=>this.taskDetails=p.filter(res => !res.endTask));
    }

    onAddTask()
    {
      this.taskManagerService.addTask(this.taskDetail).subscribe(response => 
        {
          this.results = response;
          this.openModal();
        },
        error =>
        {
          if(error.status < 200 || error.status > 300)
            this.results = JSON.parse(error._body);
            this.openModal();
        }
      );
    }

    onResetTask()
    {
      this.taskDetail = new TaskModel();
      this.taskDetail.priority = 0;
    }

    openModal() {
      this.showmodal.nativeElement.click();
    }
    closeModal() {
      this.router.navigate(['/view']);
    }
}