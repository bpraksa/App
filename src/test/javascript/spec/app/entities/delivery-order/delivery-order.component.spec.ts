/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { BrezaTestModule } from '../../../test.module';
import { DeliveryOrderComponent } from 'app/entities/delivery-order/delivery-order.component';
import { DeliveryOrderService } from 'app/entities/delivery-order/delivery-order.service';
import { DeliveryOrder } from 'app/shared/model/delivery-order.model';

describe('Component Tests', () => {
    describe('DeliveryOrder Management Component', () => {
        let comp: DeliveryOrderComponent;
        let fixture: ComponentFixture<DeliveryOrderComponent>;
        let service: DeliveryOrderService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [DeliveryOrderComponent],
                providers: []
            })
                .overrideTemplate(DeliveryOrderComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DeliveryOrderComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DeliveryOrderService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new DeliveryOrder(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.deliveryOrders[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
