import { Component, OnInit, ViewChild } from '@angular/core';
import { RedditService } from './reddit.service';
import { map, tap } from 'rxjs/operators';
import { zip } from 'rxjs';
import { ScoreComponent } from './components/score/score.component';
import { trigger, style, transition, animate } from '@angular/animations';

export type RedditPost = { url: string; title: string; dataSet: 'real' | 'fake' };

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
export class AppComponent implements OnInit {
    answered = false;
    correct: boolean;
    posts = [];
    title = 'GTFO! (Guess The Fake One)';
    total = 0;
    remaining = 0;
    showDescription = true;
    @ViewChild('score') score: ScoreComponent;
    
    private fakePosts = [];
    private realPosts = [];

    constructor(private reddit: RedditService) {}

    ngOnInit() {
        function resultMapper(post: {}, dataSet: 'real' | 'fake') {
            return { ...post, dataSet };
        }
        zip(
            this.reddit
                .getFakeNews()
                .pipe(
                    map(posts => posts.map(post => resultMapper(post, 'fake'))),
                    tap(posts => this.fakePosts.push(...posts))
                ),
            this.reddit
                .getRealNews()
                .pipe(
                    map(posts => posts.map(post => resultMapper(post, 'real'))),
                    tap(posts => this.realPosts.push(...posts))
                )
        ).subscribe(posts => {
            this.total = posts[0].length;
        });
    }

    getPosts() {
      const fakePost = this.getRandomFakePost();
      const realPost = this.getRandomRealPost();
      const coinToss = Math.floor(Math.random() * 2);
      // arrange the pair of posts based off of coin toss so that the order
      // is random each time
      this.posts = coinToss ? [fakePost, realPost] : [realPost, fakePost];
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

    private startRound() {
      this.answered = false;
      this.correct = undefined;
      this.showDescription = false;
      this.remaining = this.realPosts.length;
    }

    private getRandomFakePost() {
      const random = Math.floor(Math.random() * this.fakePosts.length);
      this.fakePosts.splice(random, 1);
      return this.fakePosts[random];
    }
    
    private getRandomRealPost() {
      const random = Math.floor(Math.random() * this.realPosts.length);
      this.realPosts.splice(random, 1);
      return this.realPosts[random];
    }
}
