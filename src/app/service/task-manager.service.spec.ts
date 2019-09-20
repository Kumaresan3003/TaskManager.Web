import { Injectable } from '@angular/core';
import { Observable, of as ObservableOf } from 'rxjs';
import { Http, Response } from '@angular/http';
import { TaskModel } from '../models/task-model';
const TaskDetails : any[] = [
    { "id": 101, "name": "Task 101", "startDate": "2018-07-23",
        "endDate" :"2018-07-28", "priority":10,"endTask":false,
        "parentTaskId":2, "parentName":"parent" },
    ];
const TaskDetail: TaskModel = new TaskModel();

export class MockTaskManagerService {
    
    getAllTasks(): Observable<TaskModel[]> {
        return ObservableOf(TaskDetails);
    }

    getTask(): Observable<TaskModel> {
        return ObservableOf(TaskDetail);
    }

    addTask(Item: TaskModel): Observable<string> {
        return ObservableOf("Success");
    }

    updateTask(Item: TaskModel, Id:number): Observable<string> {
        return ObservableOf("Success");
    }
}