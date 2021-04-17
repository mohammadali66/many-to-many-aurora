import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManyToManyAuroraComponent } from './many-to-many-aurora.component';

describe('ManyToManyAuroraComponent', () => {
  let component: ManyToManyAuroraComponent;
  let fixture: ComponentFixture<ManyToManyAuroraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManyToManyAuroraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManyToManyAuroraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
