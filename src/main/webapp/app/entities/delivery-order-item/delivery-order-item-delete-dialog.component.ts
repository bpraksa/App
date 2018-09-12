import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';
import { DeliveryOrderItemService } from './delivery-order-item.service';

@Component({
    selector: 'jhi-delivery-order-item-delete-dialog',
    templateUrl: './delivery-order-item-delete-dialog.component.html'
})
export class DeliveryOrderItemDeleteDialogComponent {
    deliveryOrderItem: IDeliveryOrderItem;

    constructor(
        private deliveryOrderItemService: DeliveryOrderItemService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.deliveryOrderItemService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'deliveryOrderItemListModification',
                content: 'Deleted an deliveryOrderItem'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-delivery-order-item-delete-popup',
    template: ''
})
export class DeliveryOrderItemDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ deliveryOrderItem }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(DeliveryOrderItemDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.deliveryOrderItem = deliveryOrderItem;
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
