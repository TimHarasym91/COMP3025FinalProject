import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Details } from '../details/details';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import { Filters } from '../../models/filters';
import { FilterService } from '../../services/filter.service';
import 'rxjs/add/operator/toPromise';

//sets variable so we have no typescript errors when using google maps
declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})

export class Home {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  data: any;
  savedResults: any;
  loading: boolean;
  mapLoaded: boolean;
  lat: any;
  lng: any;
  locationList: Object[];
  markers: Array<any> = [];
  currentItem: Object[];
  filters: Filters;
  radius: any;
  rating: any;
  keyword:any = 'restaurants';
  locationIndex: any = 0;

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private http: Http, public filterService: FilterService, private alertCtrl: AlertController) {
    this.filters = new Filters();
    this.radius = this.filterService.getRadius();
    this.filterService.radius.subscribe((radius) => {
      if(radius != this.radius) {
        console.log("distance change");
        this.locationIndex = 0;
        this.radius = radius;
      }
    });
    this.filterService.rating.subscribe((rating) => {
      if(rating != this.rating) {
        console.log("star rating change");
        // this.data.results = this.savedResults;
        this.locationIndex = 0;
        this.rating = rating;
      }
    });
    this.filterService.keyword.subscribe((keyword) => {
      if(keyword != this.keyword) {
        console.log("keyword change");
        this.locationIndex = 0;
        this.keyword = keyword;
      }
    });
    this.filterService.apply.subscribe((apply) => {
      this.findLocations();
    });

  }

  findLocations() {
    this.loading = true;
    this.mapLoaded = true;
    this.loadMap();
  }

  nextLocations(data) {
    this.clearMarkers();
    this.addMarker(data);
  }

  // ionViewDidLoad(){
  //   this.loadMap();
  // }

  // Loads the Google Maps with your geolocation
  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      let latLng = new google.maps.LatLng(this.lat, this.lng);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.searchLocations(this.lat, this.lng, this.radius);

    }, (err) => {
      console.log(err);
      var title = 'Error getting current position...';
      var msg = 'Make sure location services are turned on.';
      this.presentConfirm(title, msg);
    });
  }

  searchLocations(lat, lng, radius) {
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=YOUR_API_KEY
    var location = lat + ',' + lng;
    var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?sensor=false&location=' + encodeURI(location) + '&radius=' + radius + '&key=AIzaSyBCsfico0CX2HojOEZL_-L0IGRNtWz4rvA&callback=?&keyword=' + this.keyword + '';
    this.http.get(url).toPromise().then(res => {
      this.savedResults = res.json().results;
      this.addMarker(res.json());
    }).catch(err => {
      var title = 'Error fetching data...';
      var msg = 'Probably a CORS issue...';
      this.presentConfirm(title, msg);
      // if(confirm("There was an issue applying the filters. Reload?")) {
      //   this.rating = null;
      //   this.findLocations();
      // }
    });
  }

  addMarker(data) {
    try {
      console.log("Total locations: " + data.results.length);
      this.data = data;
      if(this.rating) {
        this.data.results = this.data.results.filter(x => x.rating >= parseFloat(this.rating));
      }
      this.locationList = data.results;
      //var randomIndex = Math.floor(Math.random() * (this.locationList.length));
      var item = data.results[this.locationIndex];
      this.currentItem = item;
      var name = item.name;
      try {
        var rating = item.rating;
        var open = item.opening_hours.open_now;
        var color;
        if(open) {
          open = "Open";
          color = "green";
        } else {
          open = "Closed";
          color = "red";
        }
      } catch(err) {
        open = '';
        rating = '';
      }
      var pos = item.geometry.location;
      var marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: pos
      });
      this.markers.push(marker);

      var infoWindow = new google.maps.InfoWindow({
        content: "<div onclick='clickGo()' class='infoWindow'><h4>" + name + "</h4><p style='color:" + color + "'>" + open + "</p><p>Rating: " + rating + "</p></div>"
      })

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(this.map, marker);
      });
      new google.maps.event.trigger( marker, 'click' );
      this.map.setCenter(marker.getPosition());
      this.loading = false;
      if(this.locationIndex != data.results.length - 1) {
        this.locationIndex++;
      } else {
        this.locationIndex = 0;
      }
    } catch (err) {
      var title = 'Error placing marker...';
      var msg = 'Coulds not find locations with keyword ' + this.keyword + '. Try increasing your search radius and/or lowering your min star rating in the filters tab.';
      this.presentConfirm(title, err);
    }
  }

  // Sets the map on all markers in the array.
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  clearMarkers() {
    this.setMapOnAll(null);
  }

  // Shows any markers currently in the array.
  showMarkers() {
    this.setMapOnAll(this.map);
  }

  // Deletes all markers in the array by removing references to them.
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  //Simple Function for opening the Details Page... Will be used later for map pins
  openPage(locationInfo, lat, lng) {
    this.navCtrl.push(Details, {
      locationInfo: locationInfo,
      lat: lat,
      lng: lng
    });
  }

  presentConfirm(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    alert.present();
  }
}
