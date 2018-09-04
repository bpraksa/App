/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BrezaTestModule } from '../../../test.module';
import { VehicleDetailComponent } from 'app/entities/vehicle/vehicle-detail.component';
import { Vehicle } from 'app/shared/model/vehicle.model';

describe('Component Tests', () => {
    describe('Vehicle Management Detail Component', () => {
        let comp: VehicleDetailComponent;
        let fixture: ComponentFixture<VehicleDetailComponent>;
        const route = ({ data: of({ vehicle: new Vehicle(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [VehicleDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(VehicleDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(VehicleDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.vehicle).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
