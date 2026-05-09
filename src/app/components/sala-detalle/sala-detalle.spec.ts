import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaDetalle } from './sala-detalle';

describe('SalaDetalle', () => {
  let component: SalaDetalle;
  let fixture: ComponentFixture<SalaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
