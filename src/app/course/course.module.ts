import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CourseRoutingModule } from './course-routing.module';
import { CourseViewerComponent } from './viewer/course-viewer.component';
import { CourseEditorComponent } from './editor/course-editor.component';

// Viewer Blocks
import { BlockViewerTextComponent } from './components/block-viewer-text/block-viewer-text.component';
import { BlockViewerLatexComponent } from './components/block-viewer-latex/block-viewer-latex.component';
import { BlockViewerImageComponent } from './components/block-viewer-image/block-viewer-image.component';
import { BlockViewerLinkComponent } from './components/block-viewer-link/block-viewer-link.component';

// Editor Blocks
import { BlockEditorTextComponent } from './components/block-editor-text/block-editor-text.component';
import { BlockEditorLatexComponent } from './components/block-editor-latex/block-editor-latex.component';
import { BlockEditorImageComponent } from './components/block-editor-image/block-editor-image.component';
import { BlockEditorLinkComponent } from './components/block-editor-link/block-editor-link.component';

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
    
    // Editors
    BlockEditorTextComponent,
    BlockEditorLatexComponent,
    BlockEditorImageComponent,
    BlockEditorLinkComponent
  ],
  imports: [
    CommonModule,
    CourseRoutingModule,
    FormsModule,
    MathjaxViewerComponent
  ]
})
export class CourseModule { }
