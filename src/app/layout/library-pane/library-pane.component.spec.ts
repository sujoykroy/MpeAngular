import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryPaneComponent } from './library-pane.component';

describe('LibraryPaneComponent', () => {
  let component: LibraryPaneComponent;
  let fixture: ComponentFixture<LibraryPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
