/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { BrezaTestModule } from '../../../test.module';
import { DeliveryOrderItemComponent } from 'app/entities/delivery-order-item/delivery-order-item.component';
import { DeliveryOrderItemService } from 'app/entities/delivery-order-item/delivery-order-item.service';
import { DeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';

describe('Component Tests', () => {
    describe('DeliveryOrderItem Management Component', () => {
        let comp: DeliveryOrderItemComponent;
        let fixture: ComponentFixture<DeliveryOrderItemComponent>;
        let service: DeliveryOrderItemService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [DeliveryOrderItemComponent],
                providers: []
            })
                .overrideTemplate(DeliveryOrderItemComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DeliveryOrderItemComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DeliveryOrderItemService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new DeliveryOrderItem(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.deliveryOrderItems[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
