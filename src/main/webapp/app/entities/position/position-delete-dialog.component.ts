import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPosition } from 'app/shared/model/position.model';
import { PositionService } from './position.service';

@Component({
    selector: 'jhi-position-delete-dialog',
    templateUrl: './position-delete-dialog.component.html'
})
export class PositionDeleteDialogComponent {
    position: IPosition;

    constructor(private positionService: PositionService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.positionService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'positionListModification',
                content: 'Deleted an position'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-position-delete-popup',
    template: ''
})
export class PositionDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ position }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PositionDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.position = position;
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
