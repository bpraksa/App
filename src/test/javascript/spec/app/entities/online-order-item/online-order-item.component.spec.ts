/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { BrezaTestModule } from '../../../test.module';
import { OnlineOrderItemComponent } from 'app/entities/online-order-item/online-order-item.component';
import { OnlineOrderItemService } from 'app/entities/online-order-item/online-order-item.service';
import { OnlineOrderItem } from 'app/shared/model/online-order-item.model';

describe('Component Tests', () => {
    describe('OnlineOrderItem Management Component', () => {
        let comp: OnlineOrderItemComponent;
        let fixture: ComponentFixture<OnlineOrderItemComponent>;
        let service: OnlineOrderItemService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [OnlineOrderItemComponent],
                providers: []
            })
                .overrideTemplate(OnlineOrderItemComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(OnlineOrderItemComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OnlineOrderItemService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new OnlineOrderItem(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.onlineOrderItems[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
