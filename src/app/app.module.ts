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


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ScenePaneComponent,
    LibraryPaneComponent,
    VerticalBarComponent,
    SceneThumbComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [SceneService],
  bootstrap: [AppComponent]
})
export class AppModule { }
