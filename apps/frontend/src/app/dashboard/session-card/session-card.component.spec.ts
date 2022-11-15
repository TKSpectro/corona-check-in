import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCardComponent } from './session-card.component';

describe('SessionCardComponent', () => {
  let component: SessionCardComponent;
  let fixture: ComponentFixture<SessionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
