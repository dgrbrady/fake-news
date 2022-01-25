import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent {
    @Input() post;
    @Input() disabled = false;
    @Output() correct: EventEmitter<boolean> = new EventEmitter();

    constructor() {}

    answer(guess: string) {
      if (guess === this.post.dataSet) {
          this.correct.emit(true);
      } else {
          this.correct.emit(false);
      }
    }
}
