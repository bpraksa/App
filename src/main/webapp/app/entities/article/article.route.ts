import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Article, IArticle } from 'app/shared/model/article.model';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ArticleDeletePopupComponent } from './article-delete-dialog.component';
import { ArticleDetailComponent } from './article-detail.component';
import { ArticleUpdateComponent } from './article-update.component';
import { ArticleComponent } from './article.component';
import { ArticleService } from './article.service';

@Injectable({ providedIn: 'root' })
export class ArticleResolve implements Resolve<IArticle> {
    constructor(private service: ArticleService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((article: HttpResponse<Article>) => article.body));
        }
        return of(new Article());
    }
}

export const articleRoute: Routes = [
    {
        path: 'article',
        component: ArticleComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.article.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'article/:id/view',
        component: ArticleDetailComponent,
        resolve: {
            article: ArticleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.article.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'article/new',
        component: ArticleUpdateComponent,
        resolve: {
            article: ArticleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.article.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'article/:id/edit',
        component: ArticleUpdateComponent,
        resolve: {
            article: ArticleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.article.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const articlePopupRoute: Routes = [
    {
        path: 'article/:id/delete',
        component: ArticleDeletePopupComponent,
        resolve: {
            article: ArticleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'brezaApp.article.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
