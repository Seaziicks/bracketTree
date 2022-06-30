import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinaryTreeTerComponent } from './binary-tree-ter.component';

describe('BinaryTreeTerComponent', () => {
  let component: BinaryTreeTerComponent;
  let fixture: ComponentFixture<BinaryTreeTerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinaryTreeTerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BinaryTreeTerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
