import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';




import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { ScenePaneComponent } from './layout/scene-pane/scene-pane.component';
import { LibraryPaneComponent } from './layout/library-pane/library-pane.component';
import { VerticalBarComponent } from './layout/vertical-bar/vertical-bar.component';
import { SceneThumbComponent } from './layout/scene-thumb/scene-thumb.component';
import { SceneService } from './misc/scene.service';
import { ToolService } from './layout/tool.service';
import { ToolButtonComponent } from './layout/tool-button/tool-button.component';
import { MaterialModule} from './material.module';
import { SceneEditorComponent } from './layout/scene-editor/scene-editor.component';
import { MpFileService } from './misc/mpfile.service';
import { ShapeThumbComponent } from './layout/shape-thumb/shape-thumb.component'

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ScenePaneComponent,
    LibraryPaneComponent,
    VerticalBarComponent,
    SceneThumbComponent,
    ToolButtonComponent,
    SceneEditorComponent,
    ShapeThumbComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [SceneService, ToolService, MpFileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
