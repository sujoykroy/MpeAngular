import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneThumbComponent } from './scene-thumb.component';

describe('SceneThumbComponent', () => {
  let component: SceneThumbComponent;
  let fixture: ComponentFixture<SceneThumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneThumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
