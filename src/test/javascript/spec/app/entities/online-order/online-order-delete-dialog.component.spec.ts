/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BrezaTestModule } from '../../../test.module';
import { OnlineOrderDeleteDialogComponent } from 'app/entities/online-order/online-order-delete-dialog.component';
import { OnlineOrderService } from 'app/entities/online-order/online-order.service';

describe('Component Tests', () => {
    describe('OnlineOrder Management Delete Component', () => {
        let comp: OnlineOrderDeleteDialogComponent;
        let fixture: ComponentFixture<OnlineOrderDeleteDialogComponent>;
        let service: OnlineOrderService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [OnlineOrderDeleteDialogComponent]
            })
                .overrideTemplate(OnlineOrderDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(OnlineOrderDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OnlineOrderService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it(
                'Should call delete service on confirmDelete',
                inject(
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
                )
            );
        });
    });
});
