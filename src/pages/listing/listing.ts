import { Component, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { NavController, NavParams, Platform, ModalController, ViewController, ActionSheetController } from 'ionic-angular';
import { DetailPage } from '../detail/detail';
import {
  GoogleMaps,
  GoogleMap,
  LatLng,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  MarkerLabel,
  MarkerIcon,
  GoogleMapsAnimation,
  Environment
} from '@ionic-native/google-maps';
import { ListingProvider } from '../../providers/listing/listing';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ServiceProvider } from '../../providers/service/service';


/**
 * Generated class for the ListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 @Component({
   selector: 'page-listing',
   templateUrl: 'listing.html',
 })
 export class ListingPage {
   @ViewChild('listing_map') mapElement: ElementRef;
   private map:GoogleMap;
   private location: LatLng;
   private display: string = 'list';
   private locations: any = [];
   private detailModal: any;
   private listings: any = [];
   private provinces: any = [];
   private province: any;
   private filter: any = {
     sort_by: 'newest',
     keyword: '',
     listing_type: '',
     property_type: '',
     province: '',
     district: '',
     min_price: '',
     max_price: ''
   };
   private land_icon: MarkerIcon;
   private house_icon: MarkerIcon;
   private apartment_icon: MarkerIcon;
   private commercial_icon: MarkerIcon;
   private room_icon: MarkerIcon;
   constructor(private platform: Platform, 
     public actionSheetCtrl: ActionSheetController, 
     private navCtrl: NavController, 
     private navParams: NavParams, 
     private modalCtrl: ModalController,
     private cf: ChangeDetectorRef,
     private viewCtrl: ViewController,
     private renderer: Renderer2,
     private listingProvider: ListingProvider,
     private sanitizer: DomSanitizer,
     private serviceProvider: ServiceProvider
     ) {

     this.land_icon = {
       url: 'https://firebasestorage.googleapis.com/v0/b/konleng-cloud.appspot.com/o/land_icon.png?alt=media&token=50038101-57b6-4d0e-8ae6-4d4a93b29a73',
       size: {
         width: 40,
         height: 40
       }
     } as MarkerIcon;
     this.house_icon = {
       url: 'https://firebasestorage.googleapis.com/v0/b/konleng-cloud.appspot.com/o/house_icon.png?alt=media&token=cbbfe331-5cdf-4cfa-9b86-8478d87e6fc6',
       size: {
         width: 40,
         height: 40
       },
     } as MarkerIcon;
     this.apartment_icon = {
       url: 'https://firebasestorage.googleapis.com/v0/b/konleng-cloud.appspot.com/o/apartment_icon.png?alt=media&token=f8ce5937-ca3b-4f45-8955-d82d28ed3f7a',
       size: {
         width: 40,
         height: 40
       }
     } as MarkerIcon;
     this.commercial_icon = {
       url: 'https://firebasestorage.googleapis.com/v0/b/konleng-cloud.appspot.com/o/commercial_icon.png?alt=media&token=09be9872-59bd-4d1d-a576-7904d94a8ada',
       size: {
         width: 40,
         height: 40
       }
     } as MarkerIcon;
     this.room_icon = {
       url: 'https://firebasestorage.googleapis.com/v0/b/konleng-cloud.appspot.com/o/room_icon.png?alt=media&token=1d08f1d9-feec-4f88-a8e0-07ad1c5aa0fd',
       size: {
         width: 40,
         height: 40
       }
     } as MarkerIcon;

     this.provinces = this.listingProvider.getProvinces();


   }


   save(event, listing){
     event.stopPropagation();

   }

   getBackground(image) {
     return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
   }

   refreshLocations(){
     this.locations = [];
     for (let listing of this.listings){
       let icon = this.land_icon;
       if (listing.property_type == 'land'){
         icon = this.land_icon;
       }
       if (listing.property_type == 'house'){
         icon = this.house_icon;
       }
       if (listing.property_type == 'apartment'){
         icon = this.apartment_icon;
       }
       if (listing.property_type == 'commercial'){
         icon = this.commercial_icon;
       }
       if (listing.property_type == 'room'){
         icon = this.room_icon;
       }
       this.locations.push({
         title: '$'+listing.price,
         disableAutoPan: true, 
         icon: icon, 
         position: {lat: parseFloat(listing.lat), lng: parseFloat(listing.lng)},
         listing: listing
       })
     }
   }

   ionViewDidEnter() {

     let province = this.navParams.get('province');
     let listing_type = this.navParams.get('listing_type');
     if (province){
       for (let p of this.provinces){
         if (p.id == province){
           this.province = p;
           this.filter.province = p.id;
         }
       }
       this.listingProvider.getAll({province: this.province.id, listing_type: listing_type}).then((listings) => {
         this.location = new LatLng(this.province.lat, this.province.lng);
         this.listings = listings;
         this.refreshLocations();
       });
     }

     let keyword = this.navParams.get('keyword');
     if (keyword){
       this.filter.keyword = keyword;
       this.filter.province = '';
       this.listingProvider.getAll({keyword: keyword}).then((listings) => {
         this.location = new LatLng(11.562108, 104.888535);
         this.listings = listings;
         this.refreshLocations();
       });
     }

     
     
   }



   refreshMap(){

     let height = this.platform.height() - 160 + 'px';
     this.renderer.setStyle(this.mapElement.nativeElement, "height", height);
     this.renderer.setStyle(this.mapElement.nativeElement, "marginTop", '5px');


     let element = this.mapElement.nativeElement;
     this.map = GoogleMaps.create(element);
     this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
       this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(() => {
         try{
           this.detailModal.dismiss();
         }catch(e){
         }
       });
       let options = {
         target: this.location,
         zoom: 10,
       };
       this.map.moveCamera(options);

       this.addMarkers();
     });

   }

   segmentChanged(e){

     this.cf.detectChanges();
     try{
       this.detailModal.dismiss();
     }
     catch(e){
     }
     if (this.display == 'map'){
       this.platform.ready().then((readySource) => {
         this.refreshMap();
       });
     }

   }

   

   ionViewWillEnter(){
     this.serviceProvider.transition();
   }

   ionViewWillLeave(){

     try{
       let data = { goDetail: false, close: true };
       this.detailModal.dismiss(data);
     }
     catch(e){
     }
   }
// https://firebasestorage.googleapis.com/v0/b/konleng-cloud.appspot.com/o/blue-dot.png?alt=media&token=79ea3640-d17c-445e-82be-7a6e01fbdb66
   addMarkers() {
     let markersWindows = [];
     let markerCluster = this.map.addMarkerCluster({
       markers: this.locations,
       icons: [
           {
             url: "/assets/imgs/cluster.png", 
             anchor: {x: 16, y: 16},
             label: {
               color: 'white',
               bold: true,
               fontSize: 13
             } as MarkerLabel
           }
         ]
       }).then((marker) => {
          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
            
            let loc = params[1].get('listing');
            this.presentDetailModal(loc);
          }); 
       });
      // for(let i = 0; i < this.locations.length; i ++){
      //   let markerSync = this.map.addMarker(this.locations[i]).then((marker) => {
      //     marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
      //       let loc = this.locations[i];
      //       this.presentDetailModal(loc);
      //     }); 
      //   });
      // } 
     
   }

   goDetail(listing){

     this.navCtrl.push(DetailPage, {
       listing: listing,
       user_id: listing.user_id
     }, {animate: false});
   }
   presentFilterModal() {
     let filterModal = this.modalCtrl.create(FilterModal, { filter: this.filter });
     filterModal.onDidDismiss(data => {
       if (!data.close){
         this.listings = data.listing;
         this.refreshLocations();
         if (this.display == 'map'){
           this.map.clear().then(() => {
             this.addMarkers();
           });  
         }
         this.filter = data.filter;

         if (!data.filter.province){
           this.province = '';
         }
         for (let p of this.provinces){
           if (p.id == this.filter.province){
             this.province = p;
           }
         }

       }

     });
     filterModal.present();
   }
   presentDetailModal(listing) {
     try{
       let data = { goDetail: false, close: true };
       this.detailModal.dismiss(data);
     }catch(e){
     }
     this.detailModal = this.modalCtrl.create(DetailModal, { listing: listing }, {cssClass: 'detail-modal' });
     this.detailModal.onDidDismiss(data => {

       if (data){
         if (data.goDetail){
           this.navCtrl.push(DetailPage, {
             listing: data.listing,
             user_id: data.listing.user_id
           },{animate: false});
         }  
       }


     });
     this.detailModal.present();
   }
 }
 @Component({
   selector: 'page-listing',
   templateUrl: 'filter.html'
 })
 export class FilterModal {
   public priceRange: any;
   public provinces: any = [];
   public districts: any = [];
   private filter: any = {
     sort_by: '',
     keyword: '',
     listing_type: '',
     property_type: '',
     province: '',
     district: '',
     min_price: '',
     max_price: ''
   };
   constructor(params: NavParams, 
     public viewCtrl: ViewController,
     private listingProvider: ListingProvider) {

     this.filter = params.get('filter');
     this.provinces = this.listingProvider.getProvinces();
     this.districts = this.listingProvider.getDistricts(this.filter.province);
   }
   dismiss() {
     let data = { 'close': true };
     this.viewCtrl.dismiss(data);
   }

   resetFilter(){
     this.filter = {
       sort_by: '',
       keyword: '',
       listing_type: '',
       property_type: '',
       province: '',
       district: '',
       min_price: '',
       max_price: ''
     };
   }

   search(){
     this.listingProvider.getAll(this.filter).then((listings) => {
       let data = {listing: listings, filter: this.filter};
       this.viewCtrl.dismiss(data);
     });
   }

   provinceChange(){
     this.districts = this.listingProvider.getDistricts(this.filter.province);
   }
 }
 @Component({
   selector: 'page-listing',
   templateUrl: 'detail.html'
 })
 export class DetailModal {
   public priceRange: any;
   private listing: any;
   constructor(private params: NavParams, public navCtrl: NavController, private sanitizer: DomSanitizer, public viewCtrl: ViewController) {


   }
   ionViewDidEnter(){
     this.listing = this.params.get('listing');
   }
   getBackground(image) {
     return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
   }
   dismiss() {
     let data = { goDetail: false, close: true };
     this.viewCtrl.dismiss(data);
   }
   goDetail(listing){
     let data = {goDetail: true, listing: listing};
     this.viewCtrl.dismiss(data);
   }
 }