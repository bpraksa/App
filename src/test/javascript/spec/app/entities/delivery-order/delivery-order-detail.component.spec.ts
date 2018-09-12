/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BrezaTestModule } from '../../../test.module';
import { DeliveryOrderDetailComponent } from 'app/entities/delivery-order/delivery-order-detail.component';
import { DeliveryOrder } from 'app/shared/model/delivery-order.model';

describe('Component Tests', () => {
    describe('DeliveryOrder Management Detail Component', () => {
        let comp: DeliveryOrderDetailComponent;
        let fixture: ComponentFixture<DeliveryOrderDetailComponent>;
        const route = ({ data: of({ deliveryOrder: new DeliveryOrder(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [DeliveryOrderDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(DeliveryOrderDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(DeliveryOrderDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.deliveryOrder).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
