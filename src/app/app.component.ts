import { Component, Inject, ViewChild } from '@angular/core';
import { NewsService } from './news.service';
import { map, shareReplay } from 'rxjs/operators';
import { ScoreComponent } from './components/score/score.component';
import { trigger, style, transition, animate } from '@angular/animations';
import { NewsPostTuple } from './news-post';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('slide', [
            transition(':enter', [
                style({ transform: 'translateY(-100%)' }),
                animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
            ])
        ])
    ]
})
export class AppComponent {
    answered = false;
    correct: boolean;
    posts$ = this.newsService.news$.pipe(
      map(posts => this.scramble(posts)),
      shareReplay(),
    );
    title = 'GTFO! (Guess The Fake One)';
    total$ = this.newsService.totalCount$;
    remaining$ = this.newsService.remainingCount$;
    showDescription = true;
    @ViewChild('score') score: ScoreComponent;
    locationUrl = this.document.location.href;   
    get tweetText() : string {
      return `I scored ${this.score.correct}/${this.score.total} on GTFO!
Think you can do any better?

Check it out at ${this.locationUrl}` 
    }

    constructor(private newsService: NewsService, @Inject(DOCUMENT) private document: Document) {}

    getPosts() {
      this.newsService.loadNext();
      this.startRound();
    }

    guessCorrect() {
        this.score.correct += 1;
        this.correct = true;
        this.answered = true;
    }

    guessWrong() {
        this.correct = false;
        this.answered = true;
    }

    private scramble(posts: NewsPostTuple): NewsPostTuple {
      const [fakePost, realPost] = posts;
      const coinToss = Math.floor(Math.random() * 2);
      // arrange the pair of posts based off of coin toss so that the order
      // is random each time
      return coinToss ? [fakePost, realPost] : [realPost, fakePost];
    }

    private startRound() {
      this.answered = false;
      this.correct = undefined;
      this.showDescription = false;
    }
}
