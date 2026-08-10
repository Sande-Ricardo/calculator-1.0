import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CourseRoutingModule } from './course-routing.module';
import { CourseViewerComponent } from './viewer/course-viewer.component';
import { CourseEditorComponent } from './editor/course-editor.component';

// Viewer Blocks
import { BlockViewerTextComponent } from './components/block-viewer-text/block-viewer-text.component';
import { BlockViewerLatexComponent } from './components/block-viewer-latex/block-viewer-latex.component';
import { BlockViewerImageComponent } from './components/block-viewer-image/block-viewer-image.component';
import { BlockViewerLinkComponent } from './components/block-viewer-link/block-viewer-link.component';
import { BlockViewerCalloutComponent } from './components/block-viewer-callout/block-viewer-callout.component';
import { BlockViewerGraphComponent } from './components/block-viewer-graph/block-viewer-graph.component';
import { BlockViewerExerciseComponent } from './components/block-viewer-exercise/block-viewer-exercise.component';
import { BlockViewerCodeComponent } from './components/block-viewer-code/block-viewer-code.component';

// Editor Blocks
import { BlockEditorTextComponent } from './components/block-editor-text/block-editor-text.component';
import { BlockEditorLatexComponent } from './components/block-editor-latex/block-editor-latex.component';
import { BlockEditorImageComponent } from './components/block-editor-image/block-editor-image.component';
import { BlockEditorLinkComponent } from './components/block-editor-link/block-editor-link.component';
import { BlockEditorCalloutComponent } from './components/block-editor-callout/block-editor-callout.component';
import { BlockEditorGraphComponent } from './components/block-editor-graph/block-editor-graph.component';
import { BlockEditorExerciseComponent } from './components/block-editor-exercise/block-editor-exercise.component';
import { BlockEditorCodeComponent } from './components/block-editor-code/block-editor-code.component';

import { MathjaxViewerComponent } from 'src/app/components/mathjax-viewer/mathjax-viewer.component';

@NgModule({
  declarations: [
    CourseViewerComponent,
    CourseEditorComponent,

    // Viewers
    BlockViewerTextComponent,
    BlockViewerLatexComponent,
    BlockViewerImageComponent,
    BlockViewerLinkComponent,
    BlockViewerCalloutComponent,
    BlockViewerGraphComponent,
    BlockViewerExerciseComponent,
    BlockViewerCodeComponent,
    
    // Editors
    BlockEditorTextComponent,
    BlockEditorLatexComponent,
    BlockEditorImageComponent,
    BlockEditorLinkComponent,
    BlockEditorCalloutComponent,
    BlockEditorGraphComponent,
    BlockEditorExerciseComponent,
    BlockEditorCodeComponent
  ],
  imports: [
    CommonModule,
    CourseRoutingModule,
    FormsModule,
    MathjaxViewerComponent,
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CourseModule { }
