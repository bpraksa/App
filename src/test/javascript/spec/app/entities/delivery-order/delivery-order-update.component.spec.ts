/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { BrezaTestModule } from '../../../test.module';
import { DeliveryOrderUpdateComponent } from 'app/entities/delivery-order/delivery-order-update.component';
import { DeliveryOrderService } from 'app/entities/delivery-order/delivery-order.service';
import { DeliveryOrder } from 'app/shared/model/delivery-order.model';

describe('Component Tests', () => {
    describe('DeliveryOrder Management Update Component', () => {
        let comp: DeliveryOrderUpdateComponent;
        let fixture: ComponentFixture<DeliveryOrderUpdateComponent>;
        let service: DeliveryOrderService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [DeliveryOrderUpdateComponent]
            })
                .overrideTemplate(DeliveryOrderUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DeliveryOrderUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DeliveryOrderService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new DeliveryOrder(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.deliveryOrder = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new DeliveryOrder();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.deliveryOrder = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
