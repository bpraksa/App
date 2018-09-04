/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { BrezaTestModule } from '../../../test.module';
import { OnlineOrderComponent } from 'app/entities/online-order/online-order.component';
import { OnlineOrderService } from 'app/entities/online-order/online-order.service';
import { OnlineOrder } from 'app/shared/model/online-order.model';

describe('Component Tests', () => {
    describe('OnlineOrder Management Component', () => {
        let comp: OnlineOrderComponent;
        let fixture: ComponentFixture<OnlineOrderComponent>;
        let service: OnlineOrderService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [OnlineOrderComponent],
                providers: []
            })
                .overrideTemplate(OnlineOrderComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(OnlineOrderComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OnlineOrderService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new OnlineOrder(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.onlineOrders[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
