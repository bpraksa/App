import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { OnlineOrderItemService } from './online-order-item.service';

@Component({
    selector: 'jhi-online-order-item-delete-dialog',
    templateUrl: './online-order-item-delete-dialog.component.html'
})
export class OnlineOrderItemDeleteDialogComponent {
    onlineOrderItem: IOnlineOrderItem;

    constructor(
        private onlineOrderItemService: OnlineOrderItemService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.onlineOrderItemService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'onlineOrderItemListModification',
                content: 'Deleted an onlineOrderItem'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-online-order-item-delete-popup',
    template: ''
})
export class OnlineOrderItemDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ onlineOrderItem }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(OnlineOrderItemDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.onlineOrderItem = onlineOrderItem;
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
