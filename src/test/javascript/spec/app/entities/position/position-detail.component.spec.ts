/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BrezaTestModule } from '../../../test.module';
import { PositionDetailComponent } from 'app/entities/position/position-detail.component';
import { Position } from 'app/shared/model/position.model';

describe('Component Tests', () => {
    describe('Position Management Detail Component', () => {
        let comp: PositionDetailComponent;
        let fixture: ComponentFixture<PositionDetailComponent>;
        const route = ({ data: of({ position: new Position(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [PositionDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PositionDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PositionDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.position).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
