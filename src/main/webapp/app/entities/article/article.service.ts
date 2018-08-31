import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IArticle } from 'app/shared/model/article.model';

type EntityResponseType = HttpResponse<IArticle>;
type EntityArrayResponseType = HttpResponse<IArticle[]>;

@Injectable({ providedIn: 'root' })
export class ArticleService {
    private resourceUrl = SERVER_API_URL + 'api/articles';

    constructor(private http: HttpClient) {}

    create(article: IArticle): Observable<EntityResponseType> {
        return this.http.post<IArticle>(this.resourceUrl, article, { observe: 'response' });
    }

    update(article: IArticle): Observable<EntityResponseType> {
        return this.http.put<IArticle>(this.resourceUrl, article, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IArticle>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IArticle[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
