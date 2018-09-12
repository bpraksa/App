import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDeliveryOrder } from 'app/shared/model/delivery-order.model';
import { DeliveryOrderService } from './delivery-order.service';

@Component({
    selector: 'jhi-delivery-order-delete-dialog',
    templateUrl: './delivery-order-delete-dialog.component.html'
})
export class DeliveryOrderDeleteDialogComponent {
    deliveryOrder: IDeliveryOrder;

    constructor(
        private deliveryOrderService: DeliveryOrderService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.deliveryOrderService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'deliveryOrderListModification',
                content: 'Deleted an deliveryOrder'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-delivery-order-delete-popup',
    template: ''
})
export class DeliveryOrderDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ deliveryOrder }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(DeliveryOrderDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.deliveryOrder = deliveryOrder;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
