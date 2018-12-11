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

     //Add cluster locations
     this.land_icon = {
       url: 'https://firebasestorage.googleapis.com/v0/b/konleng-firebase.appspot.com/o/land_icon_new.png?alt=media&token=2e7492a8-a9b6-4617-80f4-30e2da68c8d8',
       size: {
         width: 30,
         height: 40
       }
     } as MarkerIcon;
     this.house_icon = {
       url: 'https://firebasestorage.googleapis.com/v0/b/konleng-firebase.appspot.com/o/house_icon_new.png?alt=media&token=ba59f90f-575e-4dae-bfe5-2e23ec2433c7',
       size: {
         width: 30,
         height: 40
       }
     } as MarkerIcon;
     this.apartment_icon = {
       url: 'https://firebasestorage.googleapis.com/v0/b/konleng-firebase.appspot.com/o/apartment_icon_new.png?alt=media&token=4b7e32df-21f4-4f6d-aca6-4d63ffdc496b',
       size: {
         width: 30,
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
     if (province){
       for (let p of this.provinces){
         if (p.id == province){
           this.province = p;
           this.filter.province = p.id;
         }
       }
       this.listingProvider.getAll(this.province.id).then((listings) => {
         
         this.location = new LatLng(this.province.lat, this.province.lng);
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

   addMarkers() {
     let markersWindows = [];

     for(let i = 0; i < this.locations.length; i ++){
       let markerSync = this.map.addMarker(this.locations[i]).then((marker) => {
         marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
           // 
           let loc = this.locations[i];
           this.presentDetailModal(loc);
         }); 
       });
     } 
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
           this.province.text = "Any";
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
   presentDetailModal(location) {
     try{
       let data = { goDetail: false, close: true };
       this.detailModal.dismiss(data);
     }catch(e){
     }
     this.detailModal = this.modalCtrl.create(DetailModal, { listing: location.listing }, {cssClass: 'detail-modal' });
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
     this.listingProvider.filter(this.filter).then((listings) => {
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