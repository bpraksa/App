/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { BrezaTestModule } from '../../../test.module';
import { OnlineOrderUpdateComponent } from 'app/entities/online-order/online-order-update.component';
import { OnlineOrderService } from 'app/entities/online-order/online-order.service';
import { OnlineOrder } from 'app/shared/model/online-order.model';

describe('Component Tests', () => {
    describe('OnlineOrder Management Update Component', () => {
        let comp: OnlineOrderUpdateComponent;
        let fixture: ComponentFixture<OnlineOrderUpdateComponent>;
        let service: OnlineOrderService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [OnlineOrderUpdateComponent]
            })
                .overrideTemplate(OnlineOrderUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(OnlineOrderUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OnlineOrderService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new OnlineOrder(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.onlineOrder = entity;
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
                    const entity = new OnlineOrder();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.onlineOrder = entity;
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
