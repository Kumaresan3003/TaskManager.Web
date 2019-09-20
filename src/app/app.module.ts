import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { AddComponent } from './add-task/add-task.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TaskManagerService } from './service/task-manager.service';
import { ViewComponent } from './all-tasks/all-tasks.component';
import { EditComponent } from './update-task/update-task.component';
import { SearchPipe } from './pipe/search.pipe';

const appRoutes: Routes = [
  { path: "", component: AddComponent },
  { path : "add", component: AddComponent, pathMatch : "full" },
  { path : "view", component: ViewComponent, pathMatch : "full" },
  { path : "edit", component: EditComponent, pathMatch : "full" }
]

@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    ViewComponent,
    SearchPipe,
    EditComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    TaskManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
