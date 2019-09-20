import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute} from '@angular/router';
import { DatePipe } from '@angular/common';
import { ViewComponent } from './all-tasks.component';
import { from, of as observableOf, throwError } from 'rxjs';
import { TaskManagerService } from '../service/task-manager.service';
import { MockTaskManagerService } from '../service/task-manager.service.spec';
import { SearchPipe } from '../pipe/search.pipe';

describe('TaskmgrViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;
  let service : TaskManagerService; 
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')  
  };
  const TaskDetails : any[] = [
    { "id": 101, "name": "Task 101", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"endTask":false, "parentTaskId":null, "parentName":null },
    { "id": 102, "name": "Task 102", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"endTask":true, "parentTaskId":null, "parentName":null },
    { "id": 103, "name": "Task 103", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"endTask":true, "parentTaskId":102, "parentName":null },
    { "id": 104, "name": "Task 104", "startDate": "2018-07-23","endDate" :"2018-07-28", "priority":10,"endTask":false, "parentTaskId":101, "parentName":null},
    ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule],
      declarations: [ ViewComponent, SearchPipe ],
      providers: [
        {provide: TaskManagerService, useClass: MockTaskManagerService},
        { provide: ActivatedRoute, useValue: { 'queryParams': from([{ 'id': 101 }]) } },
        { provide: Router, useValue: mockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    service = TestBed.get(TaskManagerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Task details should be retrieved', () => {
    spyOn(service,'getAllTasks').and.returnValues(observableOf(TaskDetails));   
    component.ngOnInit();
    expect(4).toBe(component.taskDetails.length);  
    expect(service.getAllTasks).toHaveBeenCalled();   
  })

 it('Parent task name is mandatory', () => {
    spyOn(service,'getAllTasks').and.returnValues(observableOf(TaskDetails));   
    component.ngOnInit();    
    expect("Task 102").toBe(component.taskDetails[2].parentName);  
    expect("Task 101").toBe(component.taskDetails[3].parentName);  
    expect("task has no parent").toBe(component.taskDetails[0].parentName);  
    expect("task has no parent").toBe(component.taskDetails[1].parentName);  
    expect(service.getAllTasks).toHaveBeenCalled();   
  })

  it(' NgOnInit should handle server error', () =>
  { 
    var error = { status: 500, _body :'"Internal server error"'};
    spyOn(service,'getAllTasks').and.returnValue(throwError(error));
    component.ngOnInit();     
    expect("Internal server error").toBe(component.results);
    expect(service.getAllTasks).toHaveBeenCalled();   
  });

  it('clicking on End Task button should return Success', () => {   
    component.taskDetails = TaskDetails;   
    spyOn(service, 'updateTask').and.returnValue(observableOf("SUCCESS"));
    component.endTask(101);   
    expect("Task 101 has been closed successfully").toBe(component.results);
    expect(service.updateTask).toHaveBeenCalledWith(TaskDetails[0], 101);    
  });

  it('clicking on End Task Button should be end task', () =>
  {   
    component.taskDetails = TaskDetails;   
    spyOn(service,'updateTask').and.returnValue(observableOf("SUCCESS"));
    component.endTask(101);   
    expect(true).toBe(TaskDetails[0].endTask);
    expect(service.updateTask).toHaveBeenCalledWith(TaskDetails[0], 101);    
  });

  it('EndTask button should handle Internal server error', () => {
    component.taskDetails = TaskDetails;
    var error = { status: 500,statusText:"500", _body :'"Internal server error"'};
    spyOn(service, 'updateTask').and.returnValue(throwError(error));
    component.endTask(101);     
    expect("500-Internal server error").toBe(component.results);
    expect(service.updateTask).toHaveBeenCalledWith(TaskDetails[0], 101); 
  });

  it('Clicking on Edit button should redirect to Edit details', () => {
    component.edit(101);     
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit'], Object({ queryParams: Object({ id: 101 }) }));
  })
});