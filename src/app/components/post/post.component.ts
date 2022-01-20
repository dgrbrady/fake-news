import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
    constructor() {}

    @Input() post;
    @Output() correct: EventEmitter<boolean> = new EventEmitter();
    @Output() next = new EventEmitter();

    answered = false;

    ngOnInit() {}

    answer(guess: string) {
        if (guess === this.post.dataSet) {
            this.correct.emit(true);
        } else {
            this.correct.emit(false);
        }
        this.answered = true;
    }

    nextPost() {
        this.answered = false;
        this.next.emit();
    }
}
