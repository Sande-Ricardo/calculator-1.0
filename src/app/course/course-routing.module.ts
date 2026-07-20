import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseViewerComponent } from './viewer/course-viewer.component';
import { CourseEditorComponent } from './editor/course-editor.component';

const routes: Routes = [
  {
    path: '',
    component: CourseViewerComponent
  },
  {
    path: 'edit',
    component: CourseEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }

