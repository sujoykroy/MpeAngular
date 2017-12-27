import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { ScenePaneComponent } from './layout/scene-pane/scene-pane.component';
import { LibraryPaneComponent } from './layout/library-pane/library-pane.component';
import { VerticalBarComponent } from './layout/vertical-bar/vertical-bar.component';
import { SceneThumbComponent } from './layout/scene-thumb/scene-thumb.component';
import { SceneService } from './data/scene.service';
import { ToolService } from './layout/tool.service';
import { ToolButtonComponent } from './layout/tool-button/tool-button.component';
import { MaterialModule} from './material.module'

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ScenePaneComponent,
    LibraryPaneComponent,
    VerticalBarComponent,
    SceneThumbComponent,
    ToolButtonComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule
  ],
  providers: [SceneService, ToolService],
  bootstrap: [AppComponent]
})
export class AppModule { }
