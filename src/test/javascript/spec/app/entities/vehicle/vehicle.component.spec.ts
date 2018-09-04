/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { BrezaTestModule } from '../../../test.module';
import { VehicleComponent } from 'app/entities/vehicle/vehicle.component';
import { VehicleService } from 'app/entities/vehicle/vehicle.service';
import { Vehicle } from 'app/shared/model/vehicle.model';

describe('Component Tests', () => {
    describe('Vehicle Management Component', () => {
        let comp: VehicleComponent;
        let fixture: ComponentFixture<VehicleComponent>;
        let service: VehicleService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [VehicleComponent],
                providers: []
            })
                .overrideTemplate(VehicleComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(VehicleComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(VehicleService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Vehicle(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.vehicles[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
