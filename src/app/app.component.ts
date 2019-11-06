import { Component, OnInit, ViewChild } from '@angular/core';
import { RedditService } from './reddit.service';
import { map } from 'rxjs/operators';
import { zip } from 'rxjs';
import { ScoreComponent } from './components/score/score.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private reddit: RedditService) {}
  title = 'Fake-News';
  posts: any[] = [];
  total = 0;
  post: { title: string; dataSet: 'real' | 'fake' };
  correct: boolean;
  showDescription = true;
  @ViewChild('score', { static: true }) score: ScoreComponent;

  ngOnInit() {
    function resultMapper(title: string, dataSet: 'real' | 'fake') {
      return { title, dataSet };
    }
    zip(
      this.reddit
        .getFakeNews()
        .pipe(map(posts => posts.map(title => resultMapper(title, 'fake')))),
      this.reddit
        .getRealNews()
        .pipe(map(posts => posts.map(title => resultMapper(title, 'real'))))
    ).subscribe(posts => {
      this.posts = posts[0].concat(posts[1]);
      this.total = this.posts.length;
    });
  }

  getPost() {
    this.correct = undefined;
    this.showDescription = false;
    const random = Math.floor(Math.random() * this.posts.length);
    this.post = this.posts[random];
    this.posts.splice(random, 1);
  }

  guessCorrect() {
    this.score.correct += 1;
    this.correct = true;
  }

  guessWrong() {
    this.correct = false;
  }
}
