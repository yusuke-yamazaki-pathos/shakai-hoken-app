import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateShakaihokenComponent } from './calculate-shakaihoken.component';

describe('CalculateShakaihokenComponent', () => {
  let component: CalculateShakaihokenComponent;
  let fixture: ComponentFixture<CalculateShakaihokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculateShakaihokenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculateShakaihokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
