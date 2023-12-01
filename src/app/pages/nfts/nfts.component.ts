import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NftService } from 'src/app/services/nft.service';
import { WalletConnectModalService } from 'src/app/services/wallet-connect-modal.service';
import { WalletService } from 'src/app/services/wallet.service';
import Swal from 'sweetalert2';



enum MethodsForNftAviableOptions {
  Classic = 'Classic',
  Elite = 'Elite',
  Royal = 'Royal',
}


@Component({
  selector: 'app-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.scss']
})


export class NftsComponent {
  arrayNfts;
  currentRol;
  closeResult;
  formNft: FormGroup;
  uriCurrentImg;
  fileImgNft;
  current_img: any = "";
  loading = false;
  currentNft;
  dataReferralsForWallet: any;

  detailClassicNft = [
    {
      rubro: "Hospedaje en una Cabaña de Lujo de 1 habitación, para 2 personas, a escoger en todo el año",
      time: "1 noche",
      application: "Gratis"
    },
    {
      rubro: "Desayuno para dos personas durante toda la estadía",
      time: "",
      application: "Gratis"
    },
    {
      rubro: "Almuerzo y Cena para dos personas durante toda la estadía",
      time: "",
      application: "20% desc"
    },
    {
      rubro: "Bebidas durante la comida para dos personas durante toda la estadía",
      time: "",
      application: "20% desc"
    },
    {
      rubro: "Juguetes Acuáticos, durante toda la estadía",
      time: "2h diarias",
      application: "20% desc"
    },
    {
      rubro: "Juguetes Acuáticos, horas adicionales",
      time: "",
      application: "10% desc"
    },
    {
      rubro: "Hospedaje adicional en cualquiera de los 2 tipos de alojamiento",
      time: "",
      application: "20% desc"
    },
    {
      rubro: "Participación del Resultado del Ejercicio Fiscal",
      time: "",
      application: "% por participación"
    }
  ]

  detailEliteNft = [
    {
      rubro: "Hospedaje en una Cabaña de Lujo de 2 habitaciones, para 4 personas, a escoger en todo el año",
      time: "2 noche",
      application: "Gratis"
    },
    {
      rubro: "Desayuno para cuatro personas durante toda la estadía",
      time: "",
      application: "Gratis"
    },
    {
      rubro: "Almuerzo y Cena para cuatro personas durante toda la estadía",
      time: "",
      application: "40% desc"
    },
    {
      rubro: "Bebidas durante la comida para cuatro personas durante toda la estadía",
      time: "",
      application: "40% desc"
    },
    {
      rubro: "Juguetes Acuáticos, durante toda la estadía",
      time: "4h diarias",
      application: "40% desc"
    },
    {
      rubro: "Juguetes Acuáticos, horas adicionales",
      time: "",
      application: "30% desc"
    },
    {
      rubro: "Check Out Extendido",
      time: "",
      application: "Hasta las 2pm"
    },
    {
      rubro: "Hospedaje adicional en cualquiera de los 2 tipos de alojamiento",
      time: "",
      application: "30% desc"
    },
    {
      rubro: "Prioridad en Reserva y Uso del Resort",
      time: "",
      application: "Premium"
    },
    {
      rubro: "Prioridad en Eventos, Lanzamientos",
      time: "",
      application: "Premium"
    },
    {
      rubro: "Precios Especiales para reservas de salas de eventos",
      time: "",
      application: "Premium"
    },
    {
      rubro: "Participación del Resultado del Ejercicio Fiscal",
      time: "",
      application: "% por participación"
    }
  ]

  detailRoyalNft = [
    {
      rubro: "Hospedaje en una Cabaña de Lujo de 2 habitaciones, para 4 personas, a escoger en todo el año",
      time: "4 noche",
      application: "Gratis"
    },
    {
      rubro: "Desayuno para cuatro personas durante toda la estadía",
      time: "",
      application: "Gratis"
    },
    {
      rubro: "Almuerzo y Cena para cuatro personas durante toda la estadía",
      time: "",
      application: "80% desc"
    },
    {
      rubro: "Bebidas durante la comida para cuatro personas durante toda la estadía",
      time: "",
      application: "80% desc"
    },
    {
      rubro: "Juguetes Acuáticos, durante toda la estadía",
      time: "4h diarias",
      application: "80% desc"
    },
    {
      rubro: "Juguetes Acuáticos, horas adicionales",
      time: "",
      application: "50% desc"
    },
    {
      rubro: "Check Out Extendido",
      time: "",
      application: "Hasta las 3pm"
    },
    {
      rubro: "Hospedaje adicional en cualquiera de los 2 tipos de alojamiento",
      time: "",
      application: "50% desc"
    },
    {
      rubro: "Prioridad en Reserva y Uso del Resort",
      time: "",
      application: "VIP"
    },
    {
      rubro: "Prioridad en Eventos, Lanzamientos",
      time: "",
      application: "VIP"
    },
    {
      rubro: "Precios Especiales para reservas de salas de eventos",
      time: "",
      application: "VIP"
    },
    {
      rubro: "Participación del Resultado del Ejercicio Fiscal",
      time: "",
      application: "% por participación"
    }
  ]

  detailShow = [];

  amountOfNfts = {
    classic: 0,
    elite: 0,
    royal: 0
  }

  constructor(private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private nftService: NftService,
    private walletService: WalletService,
    public contractService: WalletConnectModalService,
    private formBuilder: FormBuilder) {
    this.formNft = formBuilder.group({
      image: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.currentRol = localStorage.getItem('type_user');
  
    this.getCantNftAvailable();
  }

  getCantNftAvailable() {
    this.nftService.getCantNftAvailable().subscribe({
      next: (data: any) => {
        this.amountOfNfts.classic = data.data.Classic;
        this.amountOfNfts.elite = data.data.Elite;
        this.amountOfNfts.royal = data.data.Royal;
        // console.log(this.amountOfNfts)
      },
      error: (error) => {

      }
    })
  }

  ngAfterViewInit() {
    document.getElementById('page-content').classList.add('nfts');
  }

  ngOnDestroy() {
    document.getElementById('page-content').classList.remove('nfts');
  }

  clickId(id) {
    document.getElementById(id)?.click();
  }

  loadImgNft($event) {
    const file = $event.target.files[0];

    // Validar si es una imagen
    if (this.isImageFile(file)) {
      this.fileImgNft = file;
      this.current_img = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    } else {
      // El archivo no es una imagen
      Swal.fire({
        title: 'Opps!',
        text: this.translateService.instant('Parece que el archivo que intentas subir no es una imagen'),
        icon: 'error'
      })

    }
  }

  isImageFile(file: File): boolean {
    const fileType = file.type;
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml', 'image/x-icon', 'image/jxr', 'image/apng', 'image/avif'];
    return validImageTypes.includes(fileType);
  }


  createNft() {
    if (this.formNft.valid) {
      if (this.fileImgNft != undefined) {
        // LLamamos al metodo para guardar la imagen y el nombre.
        this.loading = true;
        let data = {
          name: this.formNft.get('name').value,
          price: this.formNft.get('price').value,
          img: this.fileImgNft
        }

        this.nftService.createNft(data).subscribe(
          data => {
            let result: any = data;
            let uri = result.data.token_uri;
            let idNft = result.data.nft_id;
            let dataContract = {
              uri: uri,
              idNft: idNft,
              price: this.formNft.get('price').value
            }
            // Ahora nos comunicamos con el contrato y guardamos el nft
            this.contractService.addNft(dataContract).then((data) => {
              if (data == false) {
                // Borrar Imagen guardada,porque fallo el guardado en la blockchain
                this.deleteNFT(idNft, false);
              } else {
                Swal.fire({
                  icon: 'success',
                  text: this.translateService.instant('NFT creado correctamente')
                }).then(() => {
                  document.getElementById('closeModal').click();
                  //CONSULTAR LOS NFTS nuevamente
                })
              }
            }).finally(() => {
              this.loading = false;
            })
          },
          error => {
            this.loading = false;
            Swal.fire({
              icon: 'error',
              text: this.translateService.instant('Ha ocurrido un error')
            })
          })
      } else {
        Swal.fire({
          icon: 'warning',
          text: this.translateService.instant('Asegurate de cargar la imagen del nft')
        })
      }
    } else {
      this.formNft.markAllAsTouched();
    }
  }


  deleteNFT(id, showAlert) {
    if (showAlert) {
      Swal.fire({
        text: this.translateService.instant('¿Estas seguro de eliminar este NFT?'),
        confirmButtonText: this.translateService.instant('Si, eliminar'),
        cancelButtonText: this.translateService.instant('Cancelar'),
        showCancelButton: true,
        icon: 'question'
      }).then((action) => {
        if (action.isConfirmed) {
          this.loading = true;
          this.nftService.deleteNFT(id).subscribe(
            data => {
              this.loading = false;
              Swal.fire({
                text: this.translateService.instant('NFT eliminado'),
                icon: 'success',
                confirmButtonColor: '#000'
              }).then(() => {
              })
            },
            error => {
              this.loading = false;
              Swal.fire({
                text: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde'),
                icon: 'error',
                confirmButtonColor: '#000'
              })
            }
          )
        }
      })
    } else {
      this.nftService.deleteNFT(id).subscribe(
        data => {
          // console.log("Se elimino el NFT ", id)
        },
        error => {

        })
    }
  }

  getNftAviable(nft?) {
    this.contractService.getAccount().then((data) => {
      if(data != false){
        this.loading = true;
        let nameMethod: MethodsForNftAviableOptions;

        switch (nft) {
          case 1:
            nameMethod = MethodsForNftAviableOptions.Classic
            break;
          case 2:
            nameMethod = MethodsForNftAviableOptions.Elite
            break;
          case 3:
            nameMethod =  MethodsForNftAviableOptions.Royal
            break;
          default:
            break;
        }
        
        setTimeout(() => {      
          this.contractService.nftAvailable(nameMethod).then((data) => {
            // console.log("Cantidad de NFT: ", data)
            let cant = Number(data.toString());
            if(cant > 0){
              this.loading = false;
              this.getReferrals__(nft);
            }else{
              this.loading = false;
              Swal.fire({
                icon: 'warning',
                text: this.translateService.instant('No hay NFTs disponibles')
              })
            }
          }).catch((error) => {
            this.loading = false;
            Swal.fire({
              icon: 'error',
              text: this.translateService.instant('Red congestionada, vuelve a intentar')
            })
          })
        }, 500);
      }else{
        Swal.fire({
          icon: 'warning',
          text: this.translateService.instant('Conecta tu wallet y vuelve a intentarlo.')
        }).then(() => {
          document.getElementById('btn-connect-wallet').click();
        })
      }
    })
  
  }

  getReferrals__(nft) {
    this.walletService.getReferralsForWallet(nft).subscribe(
      data => {
        let result: any = data;
        this.dataReferralsForWallet = result.data;
        if (nft != undefined)
          this.buyNft(this.dataReferralsForWallet);
      },
      error => {
        Swal.fire({
          title: this.translateService.instant('Error'),
          icon: 'warning',
          text: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde')
        })
      })
  }


  buyNft(nft) {

    let data = {
      id: nft.random_id,
      usdt: nft.price,
      porcentage: this.dataReferralsForWallet.porcent,
      wallets: this.dataReferralsForWallet.wallet,
      wallet_sp: this.dataReferralsForWallet.wallet_sp,
      type_nft: this.dataReferralsForWallet.type_nft,
      token_uri: this.dataReferralsForWallet.token_uri
    }
    this.loading = true;

    this.contractService.buyNft(data).then((res) => {
      // if (res.status == true) {
      //Enviar la data a jose
      let walletConnect = localStorage.getItem('walletConnect');
      // if(walletConnect == undefined || walletConnect == null){
      //   Swal.fire({
      //     icon: 'warning',
      //     text: this.translateService.instant('Hay problemas con la conexión de tu wallet')
      //   })
      // }else{     
        let dataForBuyNft = {
          status: res.status,
          hash: res.hash,
          amount_send_usdt: nft.price,
          address_send: res.address_send,
          porcent: this.dataReferralsForWallet.porcent,
          wallet: this.dataReferralsForWallet.wallet,
          nft_id: this.dataReferralsForWallet.random_id,
        }
        document.getElementById('closeModal')?.click();
        this.nftService.buyNft(dataForBuyNft).subscribe({
          next: (data) => {
            if (res.status == true) {
              this.getCantNftAvailable();
              document.getElementById('getPointsReferrals')?.click();
              // this.arrayNfts.forEach((element, index) => {
              //   if (element.id == nft.id) {
              //     this.arrayNfts.splice(index, 1);
              //   }
              // });
            }
            // console.log("Success: ", data)
          },
          error: (error) => {
          
            // console.log("Error: ", error)
          }
        })
      // }
      // }
    }).finally(() => {
      
      this.loading = false;
    })
  }


  /**
 * La función abre una ventana modal con el contenido que se le pasa.
 * @Param Content: el contenido del modal.
 */
  openModal(content, nft?) {
    if (nft != undefined) {
      this.currentNft = nft;
      switch (nft.name) {
        case '2023 Classic':
          this.detailShow = this.detailClassicNft;
          break;
        case '2023 Elite':
          this.detailShow = this.detailEliteNft;
          break;
        case '2023 Royal':
          this.detailShow = this.detailRoyalNft;
          break;
        default:
          break;
      }
    }

    this.modalService.open(content, { backdrop: 'static', ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'detail-nft', backdropClass: 'effect-blur' }).result.then((result) => {
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
    // this.formNft.reset();
    this.uriCurrentImg = undefined;
    this.current_img = "";
    this.fileImgNft = undefined;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
