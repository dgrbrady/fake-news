import { TestBed } from '@angular/core/testing';

import { RedditService } from './reddit.service';

describe('RedditServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RedditService = TestBed.get(RedditService);
    expect(service).toBeTruthy();
  });
});
