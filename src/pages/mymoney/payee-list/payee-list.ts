import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

import { FirebaseListObservable } from 'angularfire2/database';

import { AuthService } from '../../../providers/auth-service';

import { PayeePage } from '../payee/payee';

@Component({
  selector: 'page-payee-list',
  templateUrl: 'payee-list.html'
})

export class PayeeListPage {
  
  payees: FirebaseListObservable<any>;
  groupedPayees = [];

  constructor(
      public navCtrl: NavController,
      public alertController: AlertController,
      public auth: AuthService) {}
  
  ionViewDidLoad() {

    this.auth.getAllPayees().on('value', (payees) => { 

      var that = this;
      this.groupedPayees = [];
      let currentPayees = [];
      let currentLetter = false;

      payees.forEach( spanshot => {

        let payee = spanshot.val();
        let tempPayee = ({
          $key: spanshot.key,
          payeename: payee.payeename
        });

        if(tempPayee.payeename.charAt(0) != currentLetter){
          currentLetter = tempPayee.payeename.charAt(0);
          let newGroup = {
            letter: currentLetter,
            payees: []
          };
          currentPayees = newGroup.payees;
          that.groupedPayees.push(newGroup);
        }
        currentPayees.push(tempPayee);

      })

      // Disable loading controller when the promise is complete
      this.auth.LoadingControllerDismiss();

    });
  
  }
  
  addItem() {
    this.navCtrl.push(PayeePage, { key: '0' });
  }

  editItem(payee) {
    this.navCtrl.push(PayeePage, { key: payee.$key });
  }

  deleteItem(slidingItem, payee) {
    let alert = this.alertController.create({
      title: 'Delete Payee',
      message: 'Are you sure you want to delete ' + payee.payeename + ' and ALL the transactions?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.handleSlidingItems(slidingItem);
          }
        },
        {
          text: 'Delete',
          cssClass: 'alertDanger',
          handler: () => {
            this.handleSlidingItems(slidingItem);
            this.auth.deletePayee(payee);
          }
        }
      ]
    });
    alert.present();
  }

  showTransactions() {
    console.log('TO DO: show transactions view');
  }

  handleSlidingItems(slidingItem) {
    // Close any open sliding items when the page updates
    slidingItem.close();
  }
  
}