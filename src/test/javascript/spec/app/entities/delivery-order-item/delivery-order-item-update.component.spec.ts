/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { BrezaTestModule } from '../../../test.module';
import { DeliveryOrderItemUpdateComponent } from 'app/entities/delivery-order-item/delivery-order-item-update.component';
import { DeliveryOrderItemService } from 'app/entities/delivery-order-item/delivery-order-item.service';
import { DeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';

describe('Component Tests', () => {
    describe('DeliveryOrderItem Management Update Component', () => {
        let comp: DeliveryOrderItemUpdateComponent;
        let fixture: ComponentFixture<DeliveryOrderItemUpdateComponent>;
        let service: DeliveryOrderItemService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [DeliveryOrderItemUpdateComponent]
            })
                .overrideTemplate(DeliveryOrderItemUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DeliveryOrderItemUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DeliveryOrderItemService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new DeliveryOrderItem(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.deliveryOrderItem = entity;
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
                    const entity = new DeliveryOrderItem();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.deliveryOrderItem = entity;
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
