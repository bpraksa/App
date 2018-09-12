/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BrezaTestModule } from '../../../test.module';
import { DeliveryOrderItemDetailComponent } from 'app/entities/delivery-order-item/delivery-order-item-detail.component';
import { DeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';

describe('Component Tests', () => {
    describe('DeliveryOrderItem Management Detail Component', () => {
        let comp: DeliveryOrderItemDetailComponent;
        let fixture: ComponentFixture<DeliveryOrderItemDetailComponent>;
        const route = ({ data: of({ deliveryOrderItem: new DeliveryOrderItem(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [DeliveryOrderItemDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(DeliveryOrderItemDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(DeliveryOrderItemDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.deliveryOrderItem).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
