/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { BrezaTestModule } from '../../../test.module';
import { OnlineOrderItemUpdateComponent } from 'app/entities/online-order-item/online-order-item-update.component';
import { OnlineOrderItemService } from 'app/entities/online-order-item/online-order-item.service';
import { OnlineOrderItem } from 'app/shared/model/online-order-item.model';

describe('Component Tests', () => {
    describe('OnlineOrderItem Management Update Component', () => {
        let comp: OnlineOrderItemUpdateComponent;
        let fixture: ComponentFixture<OnlineOrderItemUpdateComponent>;
        let service: OnlineOrderItemService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [OnlineOrderItemUpdateComponent]
            })
                .overrideTemplate(OnlineOrderItemUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(OnlineOrderItemUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OnlineOrderItemService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new OnlineOrderItem(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.onlineOrderItem = entity;
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
                    const entity = new OnlineOrderItem();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.onlineOrderItem = entity;
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
