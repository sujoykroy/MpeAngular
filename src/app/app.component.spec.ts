import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ScenePaneComponent } from './layout/scene-pane/scene-pane.component';
import { LibraryPaneComponent } from './layout/library-pane/library-pane.component';
import { SceneEditorComponent } from './layout/scene-editor/scene-editor.component';
import { VerticalBarComponent } from './layout/vertical-bar/vertical-bar.component';
import { ToolButtonComponent } from './layout/tool-button/tool-button.component';
import { SceneThumbComponent } from './layout/scene-thumb/scene-thumb.component';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent, FooterComponent,
        ScenePaneComponent, LibraryPaneComponent, SceneThumbComponent,
        SceneEditorComponent, VerticalBarComponent, ToolButtonComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    //const fixture = TestBed.createComponent(AppComponent);
    //const app = fixture.debugElement.componentInstance;
    //expect(app).toBeTruthy();
  }));
});
