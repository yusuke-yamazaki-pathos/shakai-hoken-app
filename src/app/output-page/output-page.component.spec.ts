import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputPageComponent } from './output-page.component';

describe('OutputPageComponent', () => {
  let component: OutputPageComponent;
  let fixture: ComponentFixture<OutputPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutputPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutputPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
