/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BrezaTestModule } from '../../../test.module';
import { OnlineOrderDetailComponent } from 'app/entities/online-order/online-order-detail.component';
import { OnlineOrder } from 'app/shared/model/online-order.model';

describe('Component Tests', () => {
    describe('OnlineOrder Management Detail Component', () => {
        let comp: OnlineOrderDetailComponent;
        let fixture: ComponentFixture<OnlineOrderDetailComponent>;
        const route = ({ data: of({ onlineOrder: new OnlineOrder(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [OnlineOrderDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(OnlineOrderDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(OnlineOrderDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.onlineOrder).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
