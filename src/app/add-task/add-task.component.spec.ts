import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, Observable, throwError } from 'rxjs';
import { FormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router,ActivatedRoute} from '@angular/router';
import { TaskManagerService } from '../service/task-manager.service';
import { AddComponent } from './add-task.component';
import { MockTaskManagerService } from '../service/task-manager.service.spec';
import { TaskModel } from '../models/task-model';

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  let service : TaskManagerService; 
  
  const TaskDetails : any[] = [{ "id": 1, "name": "Task 1", "startDate": Date.now, 
    "endDate" :Date.now, "priority":10, 
    "endTask":false, "parentTaskId":2, "parentName":"parent" },
    { "id": 2, "name": "Task 2", "startDate": Date.now, "endDate": Date.now,
     "priority":10, "endTask":true, "parentTaskId":2, "parentName":"parent" }
  ];

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule],
      declarations: [ AddComponent ] , 
      providers: [
        {provide: TaskManagerService, useClass: MockTaskManagerService},
        { provide: Router, useValue: mockRouter}
      ]
    })    
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    service = TestBed.get(TaskManagerService);
    fixture.detectChanges();
  });

  it('should create Task', () => {
    expect(component).toBeTruthy();
    //expect('Task Manager').toBe(component.title)
  });

  it('Task details should be retrieved', () => {
    spyOn(service,'getAllTasks').and.returnValues(observableOf(TaskDetails));
    component.ngOnInit();
    expect(1).toBe(component.taskDetails.length);
    expect("Task 1").toBe(component.taskDetails[0].name);
  });

  it('New Task Creation should return Success', () => {
    component.taskDetail = new TaskModel();
    spyOn(service,'addTask').and.returnValue(observableOf("SUCCESS"));
    component.onAddTask();
    //expect(component.openModal).toHaveBeenCalled();
    expect("SUCCESS").toBe(component.results);
    expect(service.addTask).toHaveBeenCalled();    
  });

  it('New Task Creation should return Internal server error', () =>
  {
    component.taskDetail = new TaskModel();   
    var error = { status: 500, _body :'"Internal server error"'};
    spyOn(service , 'addTask').and.callFake(() => {
      return throwError(error);
    });
    component.onAddTask();     
    expect("Internal server error").toBe(component.results);
    expect(service.addTask).toHaveBeenCalled();    
  });

  it('Clearing Task Details', () =>
  {
    var taskDetail = new TaskModel() ;   
    component.taskDetail = taskDetail;
    console.log(component.taskDetail.name);
    taskDetail.name ="task 1";
    taskDetail.id = 1;
    taskDetail.priority = 10;
    
    component.onResetTask();           
    expect(0).toBe(component.taskDetail.priority);
    expect(component.taskDetail.id).toBeUndefined();
    expect(component.taskDetail.name).toBeUndefined();   
  })

  it('When clicking close modal should go to view all tasks', () =>
  {
    component.closeModal();     
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/view']);
  })
});