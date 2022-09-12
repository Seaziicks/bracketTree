import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreePlayerComponent } from './tree-player.component';

describe('TreePlayerBisComponent', () => {
  let component: TreePlayerComponent;
  let fixture: ComponentFixture<TreePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreePlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
