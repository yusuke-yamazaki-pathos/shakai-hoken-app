import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCompanyComponent } from './generate-company.component';

describe('GenerateCompanyComponent', () => {
  let component: GenerateCompanyComponent;
  let fixture: ComponentFixture<GenerateCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateCompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
