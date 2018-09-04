/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BrezaTestModule } from '../../../test.module';
import { OnlineOrderItemDeleteDialogComponent } from 'app/entities/online-order-item/online-order-item-delete-dialog.component';
import { OnlineOrderItemService } from 'app/entities/online-order-item/online-order-item.service';

describe('Component Tests', () => {
    describe('OnlineOrderItem Management Delete Component', () => {
        let comp: OnlineOrderItemDeleteDialogComponent;
        let fixture: ComponentFixture<OnlineOrderItemDeleteDialogComponent>;
        let service: OnlineOrderItemService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [OnlineOrderItemDeleteDialogComponent]
            })
                .overrideTemplate(OnlineOrderItemDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(OnlineOrderItemDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OnlineOrderItemService);
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
