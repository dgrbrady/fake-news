import { Component, OnInit, ViewChild } from '@angular/core';
import { RedditService } from './reddit.service';
import { map } from 'rxjs/operators';
import { zip } from 'rxjs';
import { ScoreComponent } from './components/score/score.component';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
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
    constructor(private reddit: RedditService) {}
    title = 'Guess The Onion';
    posts: any[] = [];
    total = 0;
    post: { url: string; title: string; dataSet: 'real' | 'fake' };
    correct: boolean;
    showDescription = true;
    answered = false;
    @ViewChild('score', { static: true }) score: ScoreComponent;

    ngOnInit() {
        function resultMapper(post: {}, dataSet: 'real' | 'fake') {
            return { ...post, dataSet };
        }
        zip(
            this.reddit
                .getFakeNews()
                .pipe(
                    map(posts => posts.map(post => resultMapper(post, 'fake')))
                ),
            this.reddit
                .getRealNews()
                .pipe(
                    map(posts => posts.map(post => resultMapper(post, 'real')))
                )
        ).subscribe(posts => {
            this.posts = posts[0].concat(posts[1]);
            this.total = this.posts.length;
        });
    }

    getPost() {
        this.answered = false;
        this.correct = undefined;
        this.showDescription = false;
        const random = Math.floor(Math.random() * this.posts.length);
        this.post = this.posts[random];
        this.posts.splice(random, 1);
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
}
