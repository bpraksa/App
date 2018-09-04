import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { OnlineOrderService } from './online-order.service';

@Component({
    selector: 'jhi-online-order-delete-dialog',
    templateUrl: './online-order-delete-dialog.component.html'
})
export class OnlineOrderDeleteDialogComponent {
    onlineOrder: IOnlineOrder;

    constructor(
        private onlineOrderService: OnlineOrderService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.onlineOrderService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'onlineOrderListModification',
                content: 'Deleted an onlineOrder'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-online-order-delete-popup',
    template: ''
})
export class OnlineOrderDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ onlineOrder }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(OnlineOrderDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.onlineOrder = onlineOrder;
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
