/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BrezaTestModule } from '../../../test.module';
import { DeliveryOrderDeleteDialogComponent } from 'app/entities/delivery-order/delivery-order-delete-dialog.component';
import { DeliveryOrderService } from 'app/entities/delivery-order/delivery-order.service';

describe('Component Tests', () => {
    describe('DeliveryOrder Management Delete Component', () => {
        let comp: DeliveryOrderDeleteDialogComponent;
        let fixture: ComponentFixture<DeliveryOrderDeleteDialogComponent>;
        let service: DeliveryOrderService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [DeliveryOrderDeleteDialogComponent]
            })
                .overrideTemplate(DeliveryOrderDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(DeliveryOrderDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DeliveryOrderService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
