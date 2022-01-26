import { Pipe, PipeTransform } from '@angular/core';
import { NewsPostTuple } from '../news-post';

@Pipe({
  name: 'newsIsAvailable'
})
export class NewsIsAvailablePipe implements PipeTransform {

  transform(value: NewsPostTuple | undefined, ...args: unknown[]): boolean {
   return !(value === undefined) && value?.every((post) => post !== undefined)
  }

}
