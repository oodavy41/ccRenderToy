import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowboardComponent } from './shadowboard.component';

describe('ShadowboardComponent', () => {
  let component: ShadowboardComponent;
  let fixture: ComponentFixture<ShadowboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShadowboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShadowboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
