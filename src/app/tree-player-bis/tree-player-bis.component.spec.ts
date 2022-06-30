import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreePlayerBisComponent } from './tree-player-bis.component';

describe('TreePlayerBisComponent', () => {
  let component: TreePlayerBisComponent;
  let fixture: ComponentFixture<TreePlayerBisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreePlayerBisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreePlayerBisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
