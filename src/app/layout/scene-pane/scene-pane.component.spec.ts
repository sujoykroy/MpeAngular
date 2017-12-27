import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenePaneComponent } from './scene-pane.component';

describe('ScenePaneComponent', () => {
  let component: ScenePaneComponent;
  let fixture: ComponentFixture<ScenePaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenePaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenePaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
