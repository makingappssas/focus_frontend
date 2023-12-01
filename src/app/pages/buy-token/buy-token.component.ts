import { ChangeDetectorRef, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WalletConnectModalService } from 'src/app/services/wallet-connect-modal.service';
import { WalletService } from 'src/app/services/wallet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buy-token',
  templateUrl: './buy-token.component.html',
  styleUrls: ['./buy-token.component.scss']
})
export class BuyTokenComponent {
  value_blr;
  valueCalculate = 0;
  balanceWallet;
  currentAccount;
  dataReferralsForWallet;
  loading = false;
  balanceUsdt: any = "0";
  invalidAmount = false;
  constructor(public walletConnectModalService: WalletConnectModalService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private walletService: WalletService) {

  }

  ngOnInit() {
    // this.getBalance();
    this.detectChangesInAccount();
    this.getBalance();
  }


  clickId(id) {
    document.getElementById(id)?.click();
  }

  ngAfterViewInit() {
    document.getElementById('page-content').classList.add('buytoken');
  }

  ngOnDestroy() {
    document.getElementById('page-content').classList.remove('buytoken');
  }

  importTokenForWallet() {
    let result = this.walletConnectModalService.importTokenBlR();
  }

  getReferralsForWallet() {
    this.walletService.getReferralsForWallet(null).subscribe(
      data => {
        let result: any = data;
        this.dataReferralsForWallet = result.data;
        this.buyToken();
      },
      error => {

      })
  }

  detectChangesInAccount() {
    this.walletConnectModalService.getAccountChanges().subscribe(
      data => {
        // console.log("Data: ", data)
        if (data.isConnected) {
          this.currentAccount = data;
          this.getBalance();
        }
      },
      error => {

      })
  }



  // getBalance() {
  //   this.balanceWallet = this.walletConnectModalService.getBalance();
  //   console.log("El balance es: ", this.balanceWallet)
  // }

  calculateValue() {
    this.valueCalculate = (this.value_blr * 0.3)
    this.cdr.detectChanges();
  }

  // verifyAccount(method?) {
  //   this.walletConnectModalService.getAccount().then(
  //     (data) => {
  //       this.currentAccount = data;
  //       if (!this.currentAccount.isConnected) {
  //         Swal.fire({
  //           icon: 'warning',
  //           text: this.translateService.instant('Conecta tu wallet y vuelve a intentarlo.')
  //         }).then(() => {
  //           document.getElementById('btn-connect-wallet').click(); // da click al boton de la navbar que abre el modal de la wallet
  //         })
  //       } else {
  //         // La cuenta esta conectada, se ejecuta la función designada
  //         if(method == 'buyToken'){
  //           this.buyToken();
  //         }
  //       }
  //     }
  //   )
  // }


  verifyAccount() {
    // console.log("Entro a verificar la cuenta")
    this.walletConnectModalService.getAccount().then((data) => {
      // console.log("DATA: ", data)
      if (data != false) {
        this.getReferralsForWallet();
        this.currentAccount = data;
      } else {
        Swal.fire({
          icon: 'warning',
          text: this.translateService.instant('Conecta tu wallet y vuelve a intentarlo.')
        }).then(() => {
          document.getElementById('btn-connect-wallet').click();
          // this.walletConnectModalService.disconnectAccount().then(() => {
          //    // da click al boton de la navbar que abre el modal de la wallet
          // });
        })
      }
    })

  }

  getBalance() {
    this.walletConnectModalService.getBalanceUsdt().then((result) => {
      // console.log("result: ", result)
      if (result === false) {
      } else {
        this.balanceUsdt = result;
        this.cdr.detectChanges();
      }
      // console.log("Obteniendo el balance: ", this.balanceUsdt)
    });
  }


  buyToken() {

    if (this.currentAccount?.isConnected != undefined && this.currentAccount.isConnected) {

      if (this.value_blr != undefined) {

        if (this.currentAccount != undefined && this.currentAccount.isConnected) {
          if (this.valueCalculate > Number(this.balanceUsdt)) {
            Swal.fire({
              text: this.translateService.instant('El monto que ingresaste supera la cantidad disponible'),
              icon: 'info'
            })
          } else {
            let data = {
              usdt: this.valueCalculate,
              porcentage: this.dataReferralsForWallet.porcent,
              wallets: this.dataReferralsForWallet.wallet,
              wallet_sp: this.dataReferralsForWallet.wallet_sp
            }

            this.loading = true;
            let result = this.walletConnectModalService.buyToken(data).then((res) => {
              let datasend = {
                hash_transaction: res.hash,
                address_send: res.address_send,
                status: res.status,
                amount_send_usdt: this.valueCalculate,
                amount_recieved_blr: this.value_blr,
                wallet: this.dataReferralsForWallet.wallet,
                porcent: this.dataReferralsForWallet.porcent
              }
              this.getBalance();
              this.valueCalculate = 0;
              this.savePuschaseData(datasend);
              // console.log("La función ha terminado su proceso:", res )
            }).finally(() => {
              this.value_blr = undefined;
              // this.dataReferralsForWallet = undefined;
              this.loading = false;

              document.getElementById('getBalanceBlr')?.click();
              // console.log("La función ha terminado su proceso")
            });
          }
        }


      } else {
        Swal.fire({
          icon: 'warning',
          text: this.translateService.instant('Digita el valor')
        })
      }
    } else {
      Swal.fire({
        icon: 'warning',
        text: this.translateService.instant('Conecta tu wallet y vuelve a intentarlo.')
      }).then(() => {
        this.walletConnectModalService.disconnectAccount().then(() => {
          document.getElementById('btn-connect-wallet').click(); // da click al boton de la navbar que abre el modal de la wallet
        });
      })
    }

  }


  savePuschaseData(data) {
    this.walletService.BuyBlr(data).subscribe(
      data => {
        // console.log("Guardado exitosamente")
      },
      error => {

      })
  }
}
