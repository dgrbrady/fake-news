import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators';
import { NewsPost, NewsPostTuple } from './news-post';

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    private nextPostSubject = new BehaviorSubject(-1);
    private nextPost$ = this.nextPostSubject.asObservable(); 
    fakeNews$ = this.getFakeNews();
    realNews$ = this.getRealNews();
    news$ = this.nextPost$.pipe(
      switchMap(
        (index) => combineLatest(
          this.fakeNews$,
          this.realNews$,
        ).pipe(
          map(([fakePosts, realPosts]): NewsPostTuple => 
            index > fakePosts.length ? [undefined, undefined] : [fakePosts[index], realPosts[index]] 
          )
        )
      ),
      shareReplay(),
    );
    remainingCount$ = combineLatest(
      this.nextPost$,
      this.fakeNews$,
    ).pipe(
      map(([index, news]) => index < 1 ? news.length : news.length - index)
    );
    totalCount$ = this.fakeNews$.pipe(
      map((news) => news.length)
    );

    constructor(private http: HttpClient) {}

    loadNext() {
      const currentValue = this.nextPostSubject.value;
      this.nextPostSubject.next(currentValue + 1);
    }

    private getRealNews() {
      return this.http
        .get('https://www.reddit.com/r/nottheonion.json', {
          responseType: 'json'
        })
        .pipe(
          map(res => this.parseResponse(res, 'real')),
          distinctUntilChanged(),
          shareReplay(),
        );
    }

    private getFakeNews() {
        return this.http
          .get('https://www.reddit.com/r/theonion.json', {
              responseType: 'json'
          })
          .pipe(
            map(res => this.parseResponse(res, 'fake')),
            distinctUntilChanged(),
            shareReplay(),
          );
    }

    private parseResponse(redditData, dataSet: 'real' | 'fake'): NewsPost[] {
        if (redditData.kind === 'Listing') {
            return (redditData.data.children as Array<any>).map(child => {
                return {
                    title: child.data.title,
                    thumbnail: child.data.thumbnail,
                    url: child.data.url,
                    dataSet,
                };
            });
        } else {
            throw new Error(
                'Incorrect response, could not parse into News Post'
            );
        }
    }
}
