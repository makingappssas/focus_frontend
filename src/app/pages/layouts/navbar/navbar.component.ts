import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Notifications } from 'src/app/interfaces/notifications';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GeneralService } from 'src/app/services/general.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { WalletConnectModalService } from 'src/app/services/wallet-connect-modal.service';
import { WalletService } from 'src/app/services/wallet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  routeImgLanguage;
  wallet = "Wallet";
  walletConnect: boolean;
  currentAccount;
  acountForModal;
  accountConnect: boolean;
  linkReferrals = "";
  closeResult: string;
  typeUser;
  walletTyping = "";
  username;
  number_notifications = '0';
  notifications: Notifications[];
  internalUrl = [];
  urlInternal = [];
  loading_notifications = false;
  showNotifications = false;
  current_route;
  pointsReferrals;
  loading = false;
  balanceBlr:any = 0;
  countNft:any = 0;
  constructor(private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private generalService: GeneralService,
    private walletService: WalletService,
    private modalService: NgbModal,
    private notificationsService: NotificationsService,
    private walletConnectModalService: WalletConnectModalService,
    private router: Router) {

  }

  ngOnInit() {
    // this.getBalance();
    this.typeUser = localStorage.getItem('type_user');
    this.getNumberOfNotifications();
    if(this.typeUser == '3'){
      this.getAccount();
      this.detectChangesInAccount();
      this.detectChangesInModalConnection();
      this.getPointsReferrals();
    }
    let account = this.walletConnectModalService.getAccount();
    this.username = localStorage.getItem('username')
    this.linkReferrals = localStorage.getItem('link_referrals');
    let language = localStorage.getItem('CurrentLang');
    if (language == 'es') {
      this.routeImgLanguage = './assets/logos/spain.webp';
      this.cdr.detectChanges();
    } else if (language == 'en') {
      this.routeImgLanguage = './assets/logos/usa.webp';
      this.cdr.detectChanges();
    }

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.current_route = this.router.routerState.snapshot.url;
        this.getNumberOfNotifications();
        if(this.typeUser == '3'){
          this.getPointsReferrals();
        }
      }
    });
  }

  getPointsReferrals(){
    this.pointsReferrals = 0;
    this.generalService.getAmountOfReferrals().subscribe({
      next: (data) =>{
        this.pointsReferrals = data.data.amount_ref;
        this.countNft = data.data.nft_count;
      },
      error: ()=>{
      
      }
    })
  }

  getBalanceBlr(){
    // console.log("Obteniendo balance de blr..")
    this.walletConnectModalService.getBalanceBlr().then((result) => {
      // console.log("result: ", result)
      if(result === false){
      }else{
        this.balanceBlr = result;
        this.cdr.detectChanges();
      }
      // console.log("Obteniendo el balance blr : ", this.balanceBlr)
    });
  }


  /**
* Obtiene el número de notificaciones del servidor y si el número de notificaciones es diferente al
* anterior, actualiza el número de notificaciones.
*/
  getNumberOfNotifications() {
    this.notificationsService.cantNotifications().subscribe(
      data => {
        let result: any = data.data;


        // console.log("Permiso para ver personas: ", this.Permits?.FilterPersons)
        if (this.number_notifications != result.CantNotif) {
          this.number_notifications = result.CantNotif;
        }
      },
      error => {

      }
    )
  }


  // NOTIFICACIONES
  getNotifications() {
    this.number_notifications = '0';
    this.notificationsService.getNotifications().subscribe(
      data => {
        this.notifications = <Notifications[]>data.data;
        let contador = 0;
        this.notifications.forEach((element, index) => {

          let url = element.url;
          let a: any = url;
          if (url != null) {
            a = url.split(" ");
            if (a[0] == "inside") {
              this.internalUrl[contador] = true;
              this.urlInternal[contador] = a[1];
              // console.log("Ruta interna: ", this.urlInternal[contador])
            } else {
              this.internalUrl[contador] = false;
            }
            contador = contador + 1;
          }

          //Validamos si la notificacion contiene variables, para poder traducirlas dinamicamente
          if (element.text_notification.includes('-*')) {
            let a = element.text_notification;
            let c = a.split('-*')
            let value = c[1]
            if (c[0].includes('Tu acción ha terminado y han sido liberados')) {
              this.notifications[index].text_notification = this.translateService.instant("Tu acción ha terminado y han sido liberados") + " " + value
            } else if (c[0].includes('Ha recibido una comisión por el valor')) {
              this.notifications[index].text_notification = this.translateService.instant("Ha recibido una comisión por el valor") + " " + value

            } else if (c[0].includes('Tienes una respuesta de')) {
              this.notifications[index].text_notification = this.translateService.instant("Tienes una respuesta de") + " " + value
            } else if (c[0].includes('Tienes un ticket creado por')) {
              this.notifications[index].text_notification = this.translateService.instant("Tienes un ticket creado por") + " " + value
            } else if (c[0].includes('Has recibido una transferencia de')) {
              this.notifications[index].text_notification = this.translateService.instant("Has recibido una transferencia de") + " " + value
            }

          }
          // console.log(a)

        });
        // console.log(this.internalUrl)
        this.loading_notifications = false;
        if (this.notifications.length > 0) {
          this.showNotifications = true;
        } else {
          this.showNotifications = false;
        }
      },
      error => {

      }
    )
  }




  /**
   * Eliminar una notificación de la base de datos y de la matriz de notificaciones que
   * tengo en el componente.
   * @param id - número;
   */
  deleteNotification(id) {
    Swal.fire({
      text: this.translateService.instant("¿Estás seguro de eliminar esta notificación?"),
      icon: 'question',
      confirmButtonColor: '#000',
      confirmButtonText: this.translateService.instant('Eliminar'),
      cancelButtonText: this.translateService.instant('Cancelar'),
      showCancelButton: true
    }).then((action) => {
      if (action.isConfirmed) {
        this.notificationsService.deleteNotification([id]).subscribe(
          data => {
            let count = 0;
            this.notifications.forEach(element => {
              if (element.id == id) {
                this.notifications.splice(count, 1)
                count = count + 1;
              }
            });
          },
          error => {

          }
        )
      } else {

      }

    })

  }

  /**
* La función toma dos parámetros, el primero es el contenido del modal, el segundo es el tipo de
* modal. Luego, la función abre el modal con el contenido y el tipo pasados.
* @param content - El contenido modal
* @param {string} type - cadena - El tipo de modal para abrir. Esto se usa para establecer la
* propiedad windowClass del modal.
*/
  showModal(content, type: string) {
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title', windowClass: type }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


    /**
* Estoy eliminando todas las notificaciones que están en la matriz "notificaciones"
*/
deleteAllNotify() {
  Swal.fire({
    text: this.translateService.instant("¿Estás seguro de eliminar todas las notificaciónes?"),
    icon: 'question',
    confirmButtonColor: '#000',
    confirmButtonText: this.translateService.instant('Eliminar'),
    cancelButtonText: this.translateService.instant('Cancelar'),
    showCancelButton: true
  }).then((action) => {
    if (action.isConfirmed) {
      this.loading = true;

      let data = [];
      this.notifications.forEach(element => {
        data.push(element.id)
      });
      //console.log(data)
      this.notificationsService.deleteNotification(data).subscribe(
        data => {
          this.loading = false;
          let count = 0;
          Swal.fire({
            title: this.translateService.instant("¡Éxito!"),
            text: this.translateService.instant("Notificaciones eliminadas"),
            icon: 'success',
            confirmButtonColor: '#000'
          }).then(() => {
            document.getElementById('closeModal').click()
            this.notifications = [];
          })

        }
      )
    } else {

    }

  })

}




  /**
   * Si la URL es nula, no haga nada. Si la URL no es nula, haga clic en el botón cerrar modal y luego
   * haga clic en el botón ir a Url.
   * @param url - la url para ir
   * @param [item] - el elemento en el que se hace clic
   */
  gotoUrl(url, item?) {
    if (url == "null" || url == null) {

    } else {
      let name = "goToUrl" + item
      document.getElementById('closeModal')?.click()
      document.getElementById(name).click();
    }
  }

  getBalance() {
    this.walletConnectModalService.getBalanceUsdt().then((result) => {
      // console.log("balance: ", result)
    });
  }

  getAccount(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.walletConnectModalService.getAccount().then(
        (data) => {
          // console.log("Account - navbar: ", data);
          this.acountForModal = data;
          this.accountConnect = data.isConnected;
          localStorage.setItem('walletConnect', data.address)
          if (this.accountConnect) {
            // console.log("Procesamos el nombre")
            this.processNameWallet(data);
            this.getBalanceBlr();
            // this.detectChangesInAccount();
            resolve(true);
          } else {
            let statusInitAccount = localStorage.getItem('statusInitAccount');
            if(statusInitAccount == null || statusInitAccount == undefined){
              localStorage.setItem('statusInitAccount', 'off');
            }
            // console.log("La wallet está desconectada.");
            this.wallet = 'Wallet';
            resolve(false);
          }
        }
      ).catch(error => {
        console.error("Error al obtener la cuenta:", error);
        reject(error);
      });
    });
  }


  saveWalletForPay() {
    if (this.walletTyping != "") {
      this.walletService.sendWalletForPayments(this.walletTyping).subscribe(
        data => {
          Swal.fire({
            icon: 'success',
            text: this.translateService.instant('Tu wallet de pago se ha guardado')
          }).then(() => {
            document.getElementById('closeModal')?.click();
            localStorage.setItem('wallet', this.walletTyping);

          })
        },
        error => {
          if (error.error.error == 'this address not valid') {
            Swal.fire({
              icon: 'error',
              text: this.translateService.instant('La wallet que intentas guardar no es valida')
            })
          } else if(error.error.error == 'This address already in other account'){
            Swal.fire({
              icon: 'error',
              text: this.translateService.instant('La wallet que intentas guardar, ya se encuentra registrada')
            })
          } else {
            Swal.fire({
              icon: 'error',
              text: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde')
            })
          }
        })
    } else {
      Swal.fire({
        icon: 'warning',
        text: this.translateService.instant('Debes digitar la wallet')
      })
    }
  }

  /**
* Copia una cadena al portapapeles.
* @param argument - 'valor a copiar'
*/
  copy(argument) {
    let walletSaved = localStorage.getItem('wallet');
    if (walletSaved == undefined) {
      if (this.accountConnect) {
        Swal.fire({
          text: this.translateService.instant('¿Deseas agregar ') + this.wallet + this.translateService.instant(' como tu wallet de pago?'),
          icon: 'question',
          confirmButtonText: this.translateService.instant('Agregar'),
          cancelButtonText: this.translateService.instant('Usar una distinta'),
          showCancelButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            // console.log("Cuenta actual: ", this.currentAccount.address)
            this.walletTyping = this.currentAccount.address;
            this.saveWalletForPay();
          } else {
            this.walletTyping = "";
            document.getElementById('openModalAddWallet').click();
          }
        })
      } else {
        document.getElementById('openModalAddWallet').click();
        // console.log("Account: ", this.accountConnect)
      }
    } else {
      let textCopy = ""
      textCopy = argument;
      // // console.log("Entro al copiar")
      let textarea;
      let result;
      try {
        textarea = document.createElement('textarea');
        textarea.setAttribute('readonly', true);
        textarea.setAttribute('contenteditable', true);
        textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
        textarea.value = textCopy;

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        const range = document.createRange();
        range.selectNodeContents(textarea);

        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        textarea.setSelectionRange(0, textarea.value.length);
        result = document.execCommand('copy');
        Swal.fire({
          text: this.translateService.instant("Texto copiado exitosamente"),
          icon: "success"
        })
        textarea.style.display = 'none';
      } catch {
        // // console.log("Entro al catch")
      }
    }


    // // console.log("Se compartira el video: ", "http://localhost:4200/audios/"+id)
  }

  detectChangesInAccount() {
    // console.log("Detectar cambios en la cuenta")
    // return new Promise<boolean>((resolve, reject) => {
    this.walletConnectModalService.getAccountChanges().subscribe(
      (data) => {
        // console.log("Account - navbar: ", data);
        this.acountForModal = data;
        this.accountConnect = data.isConnected;
        localStorage.setItem('walletConnect', data.address)
        if (this.accountConnect) {
          // console.log("Procesar nombre")
          this.processNameWallet(data);
          this.getBalanceBlr();
          // this.detectChangesInAccount();
          // resolve(true);
        } else {
          let statusInitAccount = localStorage.getItem('statusInitAccount');
          if (statusInitAccount == null || statusInitAccount == undefined) {
            localStorage.setItem('statusInitAccount', 'off');
          }
          this.wallet = 'Wallet';
          // resolve(false);
        }
      }
    ), error => {
      console.error("Error al obtener la cuenta:", error);

    };
    // });
  }

  processNameWallet(wallet) {
    this.wallet = wallet.address;
    this.currentAccount = wallet;
    let part1 = this.wallet.toString().slice(0, 4)
    let part2 = this.wallet.toString().slice(-4)
    this.wallet = "" + part1 + "..." + part2;
    this.cdr.detectChanges();
  }



  saveWalletAccount(account) {

    this.walletService.sendWalletAccount(account).subscribe(
      data => {

      },
      error => {

      })
  }

  connectWallet() {
    this.walletConnectModalService.openModal().then((data) => {

    });
  }

  detectChangesInModalConnection() {
    // console.log("HOLA")
    this.walletConnectModalService.subscribeModal().subscribe(
      data => {
        if (data.open) { // El modal esta abierto
        } else {
          /**
           * Dado que el modal se ha cerrado verificaremos si el usuario realizo la conexión con la wallet o no, llamando al metodo que retorna el estado de la cuenta 
           * */
          // let coneccted = this.getAccount().then((result)=>{
          let statusInitAccount = localStorage.getItem('statusInitAccount');
          if (this.accountConnect && statusInitAccount == 'off') {
            // console.log("La cuenta estaba desconectada y ahora se acabo de conectar")
            this.saveWalletAccount(this.acountForModal.address); // Guardamos la wallet
            localStorage.setItem('statusInitAccount', 'on');
          }
          // else if(!result && statusInitAccount == 'off'){
          //   // console.log("La cuenta estaba desconectada y sigue desconectada")
          // }else if(result && statusInitAccount == 'on'){
          //   // console.log("La cuenta estaba conectada y sigue conectada")
          // }
          else if (!this.accountConnect && statusInitAccount == 'on') {
            // console.log("La cuenta estaba conectada y se acabo de desconectar")
            localStorage.removeItem('walletConnect');
            localStorage.setItem('statusInitAccount', 'off');
            this.saveWalletAccount(null); // Establecemos la wallet en null
          }
          // });
        }
      },
      error => {
        // console.log("ERROR Estado del modal: ", error)
      })
  }

  clearSessionWallet() {
    localStorage.removeItem('wc@2:core:0.3//keychain');
    localStorage.removeItem('wc@2:universal_provider:/namespaces');
    localStorage.removeItem('wc@2:universal_provider:/optionalNamespaces');
    localStorage.removeItem('wc@2:core:0.3//pairing');
    localStorage.removeItem('wc@2:core:0.3//subscription');
    localStorage.removeItem('wc@2:core:0.3//wc@2:core:0.3//expirer');
    localStorage.removeItem('wc@2:client:0.3//proposal');
    localStorage.removeItem('wc@2:core:0.3//messages');
    localStorage.removeItem('wc@2:client:0.3//session');
    localStorage.removeItem('wc@2:ethereum_provider:/chainId');
    localStorage.removeItem('wc@2:core:0.3//history');
    localStorage.removeItem('wc@2:core:0.3//expirer');
    localStorage.removeItem('WCM_VERSION');
    localStorage.removeItem('loglevel');



    this.walletConnect = false;
  }

  logOut() {
    Swal.fire({
      icon: 'question',
      text: this.translateService.instant('¿Seguro que deseas salir de sesión?'),
      confirmButtonText: this.translateService.instant('Si, salir de sesión'),
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('Cancelar'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.authenticationService.logOut().subscribe(
          data => {
            this.walletConnectModalService.disconnectAccount();
            this.router.navigate(['/auth'])
          },
          error => {

          })
      } else {
      }
    })

  }

  goTo(route) {
    this.router.navigate(['/' + route])
  }


  setLanguauge(language) {
    this.translateService.use(language);
    if (language == 'es') {
      this.routeImgLanguage = './assets/logos/spain.webp';
      this.cdr.detectChanges();
    } else if (language == 'en') {
      this.routeImgLanguage = './assets/logos/usa.webp';
      this.cdr.detectChanges();
    }
    this.generalService.changeLanguage(language).subscribe(
      data => {

      },
      error => {

      })
    localStorage.setItem('CurrentLang', language);
  }

  /**
* La función abre una ventana modal con el contenido que se le pasa.
* @Param Content: el contenido del modal.
*/
  openModal(content) {
    this.modalService.open(content, { backdrop: 'static', ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'changePassword', backdropClass: 'effect-blur' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  /**
* Si el usuario presiona la tecla ESC, regrese 'presionando ESC'.Si el usuario hace clic en el telón de fondo,
* Regrese 'haciendo clic en un telón de fondo'.De lo contrario, regrese 'con:' + razón.
* @param {cualquier razón}, cualquiera, la razón por la que se descarta el modal.
* @returns La razón por la que se está cerrando el modal.
*/
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
