export class TaskModel
{    
    id:number;
    name:string;
    startDate:Date;
    endDate:Date;
    priority:number;
    parentTaskId:number;  
    parentName:string; 
    endTask:boolean;    
}