import { ReplaySubject } from 'rxjs/ReplaySubject';

export class FilterService {
  public radius : ReplaySubject<any> = new ReplaySubject(1);
  public rating : ReplaySubject<any> = new ReplaySubject(1);

  constructor() {
    this.setRadius(1500);
  }

  setRadius(radius) {
    this.radius.next(JSON.stringify(radius));
  }

  getRadius() {
    return this.radius;
  }

  setRating(rating) {
    this.rating.next(JSON.stringify(rating));
  }

  getRating() {
    return this.rating;
  }
}
