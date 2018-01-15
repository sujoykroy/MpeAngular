import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SceneService } from './misc/scene.service';
import { ToolService } from './layout/tool.service';
import { MpFileService } from './misc/mpfile.service';

import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { ScenePaneComponent } from './layout/scene-pane/scene-pane.component';
import { LibraryPaneComponent } from './layout/library-pane/library-pane.component';
import { VerticalBarComponent } from './layout/vertical-bar/vertical-bar.component';
import { SceneThumbComponent } from './layout/scene-thumb/scene-thumb.component';

import { ToolButtonComponent } from './layout/tool-button/tool-button.component';
import { MaterialModule} from './material.module';
import { SceneEditorComponent } from './layout/scene-editor/scene-editor.component';
import { ShapeThumbComponent } from './layout/shape-thumb/shape-thumb.component'

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MasterTimeLineComponent } from './layout/master-time-line/master-time-line.component';
import { TimeMarkerEditorComponent } from './layout/time-marker-editor/time-marker-editor.component';
import { YesNoDialogComponent } from './layout/yes-no-dialog/yes-no-dialog.component';
import { ShapePropComponent } from './layout/shape-prop/shape-prop.component';

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
        ShapeThumbComponent,
        MasterTimeLineComponent,
        TimeMarkerEditorComponent,
        YesNoDialogComponent,
        ShapePropComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        MaterialModule,
        BrowserAnimationsModule,
        FormsModule
    ],
    providers: [
        SceneService, ToolService, MpFileService
    ],
    entryComponents: [
        TimeMarkerEditorComponent,
        YesNoDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
