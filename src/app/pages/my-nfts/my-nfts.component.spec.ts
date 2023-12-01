import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNftsComponent } from './my-nfts.component';

describe('MyNftsComponent', () => {
  let component: MyNftsComponent;
  let fixture: ComponentFixture<MyNftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyNftsComponent]
    });
    fixture = TestBed.createComponent(MyNftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
