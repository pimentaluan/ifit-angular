import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreinosListComponent } from './treinos-list.component';

describe('TreinosListComponent', () => {
  let component: TreinosListComponent;
  let fixture: ComponentFixture<TreinosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreinosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreinosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
