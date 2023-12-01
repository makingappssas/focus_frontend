import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadFilesAcademyComponent } from './load-files-academy.component';

describe('LoadFilesAcademyComponent', () => {
  let component: LoadFilesAcademyComponent;
  let fixture: ComponentFixture<LoadFilesAcademyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadFilesAcademyComponent]
    });
    fixture = TestBed.createComponent(LoadFilesAcademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
