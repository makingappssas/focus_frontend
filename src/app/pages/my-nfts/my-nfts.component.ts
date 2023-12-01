import { Component } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NftService } from 'src/app/services/nft.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-nfts',
  templateUrl: './my-nfts.component.html',
  styleUrls: ['./my-nfts.component.scss']
})
export class MyNftsComponent {
  loading = false;
  arrayNfts = [];
  currentNft;
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
  closeResult: string;
  env = environment;
  constructor(private nftService: NftService,
    private translateService: TranslateService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.getMyNfts();
  }


  clickId(id) {
    document.getElementById(id).click();
  }

  getMyNfts() {
    this.loading = true;
    this.nftService.getMyNFTs().subscribe({
      next: (data) => {
        this.loading = false;
        this.arrayNfts = data.data;
      },
      error: error => {
        this.loading = false;
      }
    });
  }


  /**
* Copia una cadena al portapapeles.
* @param argument - 'valor a copiar'
*/
  copy(argument) {
    let walletSaved = localStorage.getItem('wallet');

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



    // // console.log("Se compartira el video: ", "http://localhost:4200/audios/"+id)
  }


  openModal(content, nft?) {
    // console.log(nft)
    if (nft != undefined) {
      this.currentNft = nft;
      if (nft.name.includes('Classic')) {
        this.detailShow = this.detailClassicNft;
      } else if (nft.name.includes('Elite')) {
        this.detailShow = this.detailEliteNft;
      } else if (nft.name.includes('Royal')) {
        this.detailShow = this.detailRoyalNft;
      }
    }

    this.modalService.open(content, { backdrop: 'static', ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'detail-nft', backdropClass: 'effect-blur' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  ngAfterViewInit() {
    document.getElementById('page-content').classList.add('nfts');
  }

  ngOnDestroy() {
    document.getElementById('page-content').classList.remove('nfts');
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
