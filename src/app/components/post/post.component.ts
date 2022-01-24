import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnChanges {
    constructor() {}

    @Input() post;
    @Output() correct: EventEmitter<boolean> = new EventEmitter();

    answered = false;

    ngOnChanges(changes: SimpleChanges) {
      if (changes?.post.currentValue !== changes?.post.previousValue) {
        this.answered = false;
      }
    }

    answer(guess: string) {
        if (guess === this.post.dataSet) {
            this.correct.emit(true);
        } else {
            this.correct.emit(false);
        }
        this.answered = true;
    }
}
