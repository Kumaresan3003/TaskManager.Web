import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router,ActivatedRoute} from '@angular/router';
import { EditComponent } from './update-task.component';
import { from, of as observableOf, throwError } from 'rxjs';
import { TaskManagerService } from '../service/task-manager.service';
import { MockTaskManagerService } from '../service/task-manager.service.spec';
import { TaskModel } from '../models/task-model';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let service : TaskManagerService; 
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const TaskDetails : any[] = [
    { "id": 101, "name": "Task 101", "startDate": Date.now,"endDate" :Date.now, "priority":10,"endTask":false, "parentTaskId":2, "parentName":"parent" },
    { "id": 102, "name": "Task 102", "startDate": Date.now, "endDate" :Date.now, "priority":10, "endTask":true, "parentTaskId":2, "parentName":"parent" },
    { "id": 103, "name": "Task 103", "startDate": Date.now, "endDate" :Date.now, "priority":10, "endTask":false, "parentTaskId":2, "parentName":"parent" },
    { "id": 104, "name": "Task 104", "startDate": Date.now, "endDate" :Date.now, "priority":10, "endTask":false, "parentTaskId":2, "parentName":"parent" }
    ];

    const TaskDetail : any =  { "id": 101, "name": "Task 101", "startDate": Date.now,"endDate" :Date.now,
     "priority":10,"endTask":false, "parentTaskId":103, "parentName":"Task 103" };

  //let params: Subject<Params>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule],
      declarations: [ EditComponent ],
      providers: [
        {provide: TaskManagerService, useClass: MockTaskManagerService},
        { provide: ActivatedRoute, useValue: { 'queryParams': from([{ 'id': 101 }]) } },
        { provide: Router, useValue: mockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    service = TestBed.get(TaskManagerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('id should be extracted from query string', () => {
    spyOn(service,'getAllTasks').and.returnValues(observableOf(TaskDetails));
    spyOn(service,'getTask').and.returnValues(observableOf(TaskDetail));
    component.ngOnInit();
    expect(101).toBe(component.updateTaskId);  
  });

  it('Task details should be fetched', () => {
    spyOn(service,'getAllTasks').and.returnValues(observableOf(TaskDetails));
    spyOn(service,'getTask').and.returnValues(observableOf(TaskDetail));
    component.ngOnInit();
    expect(service.getTask).toHaveBeenCalled();   
    expect(service.getAllTasks).toHaveBeenCalled();   
    expect("Task 101").toBe(component.taskDetail.name);  
    expect(10).toBe(component.taskDetail.priority);  
    expect("Task 103").toBe(component.taskDetail.parentName);  
    expect(103).toBe(component.taskDetail.parentTaskId);  
    expect(false).toBe(component.showError);
  });

  it('Application Should handle status code 400 error', () => {
    spyOn(service,'getAllTasks').and.returnValues(observableOf(TaskDetails));    
    var error = { status: 400, _body :'"Bad Request"'};
    spyOn(service,'getTask').and.returnValue(throwError(error));
    component.ngOnInit();
    expect("Bad Request").toBe(component.results);
    expect(true).toBe(component.showError);
    expect(service.getTask).toHaveBeenCalled();    
    expect(service.getAllTasks).toHaveBeenCalled();   
  });

  it('Clicking on Update button should update task details', () =>
  {
    var taskDetail = new TaskModel();
    taskDetail.id= 101;
    component.taskDetail = taskDetail;
    spyOn(service,'updateTask').and.returnValue(observableOf("SUCCESS"));
    component.onUpdateTask();   
    expect("SUCCESS").toBe(component.results);
    expect(service.updateTask).toHaveBeenCalledWith(taskDetail, 101);    
  });

  it('Update task should handle Bad Request', () =>
  {
    var taskDetail = new TaskModel();
    taskDetail.id= 101;
    component.taskDetail = taskDetail;
    var error = { status: 400, _body :'"Bad Request"'};
    spyOn(service,'updateTask').and.returnValue(throwError(error));
    component.onUpdateTask();     
    expect("Bad Request").toBe(component.results);
    expect(service.updateTask).toHaveBeenCalledWith(taskDetail, 101); 
  });

  it('clicking on Cancel button should redirect to view all task details', () => {
    component.onCancel();     
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/view']);
  })

  it('Clicking on Edit button should redirect to view all task details', () => {
    component.closeModal();     
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/view']);
  })
});