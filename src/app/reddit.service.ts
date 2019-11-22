import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RedditService {
    constructor(private http: HttpClient) {}

    getRealNews() {
        return this.http
            .get('https://www.reddit.com/r/nottheonion.json', {
                responseType: 'json'
            })
            .pipe(map(res => this.parseResponse(res)));
    }

    getFakeNews() {
        return this.http
            .get('https://www.reddit.com/r/theonion.json', {
                responseType: 'json'
            })
            .pipe(map(res => this.parseResponse(res)));
    }

    private parseResponse(res) {
        if (res.kind === 'Listing') {
            return (res.data.children as Array<any>).map(child => {
                return {
                    title: child.data.title,
                    thumbnail: child.data.thumbnail,
                    url: child.data.url
                };
            });
        } else {
            throw new Error(
                'Incorrect response, could not parse into News Post'
            );
        }
    }
}
