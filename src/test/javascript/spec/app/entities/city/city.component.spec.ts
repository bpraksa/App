/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { BrezaTestModule } from '../../../test.module';
import { CityComponent } from 'app/entities/city/city.component';
import { CityService } from 'app/entities/city/city.service';
import { City } from 'app/shared/model/city.model';

describe('Component Tests', () => {
    describe('City Management Component', () => {
        let comp: CityComponent;
        let fixture: ComponentFixture<CityComponent>;
        let service: CityService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [CityComponent],
                providers: []
            })
                .overrideTemplate(CityComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CityComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CityService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new City(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.cities[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
