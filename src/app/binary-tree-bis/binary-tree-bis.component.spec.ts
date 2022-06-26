import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinaryTreeBisComponent } from './binary-tree-bis.component';

describe('BinaryTreeBisComponent', () => {
  let component: BinaryTreeBisComponent;
  let fixture: ComponentFixture<BinaryTreeBisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinaryTreeBisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BinaryTreeBisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
