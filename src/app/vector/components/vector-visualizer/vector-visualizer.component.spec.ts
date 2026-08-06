import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VectorVisualizerComponent } from './vector-visualizer.component';

describe('VectorVisualizerComponent', () => {
  let component: VectorVisualizerComponent;
  let fixture: ComponentFixture<VectorVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VectorVisualizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VectorVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
