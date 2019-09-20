import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TaskModel } from '../models/task-model';
    
@Injectable()
export class TaskManagerService {
    baseUrl: string ="http://localhost/api/task/";     

    constructor(private http: Http) {
    }

    getAllTasks(): Observable<TaskModel[]> {   
        return this.http.get(this.baseUrl).pipe(
            map(this.extractResponse)
        );      
    }

    getTask(Id:number):Observable<TaskModel>
    {   
        return this.http.get(this.baseUrl+Id).pipe(
            map((data:Response) => <TaskModel>data.json())
        );   
    }

    addTask(Item:TaskModel):Observable<string>
    {
        return this.http.post(this.baseUrl,Item).pipe(
            map((data:Response) => <string>data.json())
        );
    }

    updateTask(Item:TaskModel, Id:number):Observable<string>
    {
      return this.http.put(this.baseUrl+Id,Item).pipe(
        map((data:Response) => <string>data.json())
      );
    }

    private extractResponse(response: Response) {
        if (response.status < 200 || response.status >= 300) {
           throw new Error('Bad response status: ' + response.status);
        }
        let body = response.json(); // parse JSON string into JavaScript objects
    
        return body || { };
      }    
}