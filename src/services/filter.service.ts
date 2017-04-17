import { ReplaySubject } from 'rxjs/ReplaySubject';

export class FilterService {
  public radius : ReplaySubject<any> = new ReplaySubject(1);
  public rating : ReplaySubject<any> = new ReplaySubject(1);
  public keyword : ReplaySubject<any> = new ReplaySubject(1);
  public apply : ReplaySubject<any> = new ReplaySubject(1);

  constructor() {
    this.setRadius(3000);
  }

  applyClicked() {
    this.apply.next(JSON.stringify("apply clicked"));
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

  setKeyword(keyword) {
    this.keyword.next(JSON.stringify(keyword));
  }

  getKeyword() {
    return this.keyword;
  }
}
