/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BrezaTestModule } from '../../../test.module';
import { OnlineOrderItemDetailComponent } from 'app/entities/online-order-item/online-order-item-detail.component';
import { OnlineOrderItem } from 'app/shared/model/online-order-item.model';

describe('Component Tests', () => {
    describe('OnlineOrderItem Management Detail Component', () => {
        let comp: OnlineOrderItemDetailComponent;
        let fixture: ComponentFixture<OnlineOrderItemDetailComponent>;
        const route = ({ data: of({ onlineOrderItem: new OnlineOrderItem(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [OnlineOrderItemDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(OnlineOrderItemDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(OnlineOrderItemDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.onlineOrderItem).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
