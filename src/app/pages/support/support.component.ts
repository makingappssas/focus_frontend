import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, fromEvent } from 'rxjs';
import { Tickets } from 'src/app/interfaces/tickest';

import { SupportService } from 'src/app/services/support.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  Permits: any;
  closeResult: string;
  showToast: boolean;
  base64textString = [];
  current_img: any;
  nameCurrentImg = "";
  loading_spinner = false;

  nameNewTicket = "";
  typeNewTicket = "";

  categories = [];
  listTickets = [];

  page = 1;
  pageSize = 6;
  items_per_page = 8;

  statusPqrs = [];
  currentRol;
  nameFilterStatus = "Estados";
  currentStatusPqrs = "";
  currentCategory = "";
  nameFilterCategory = "Categorias";
  loading = false;
  suspend: string;
  constructor(private router: Router,
    private translate: TranslateService,
    private supportService: SupportService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.suspend = localStorage.getItem('c3VzcGVuZA==');
    this.getStatus();
    this.ObtainCategories();
    this.getTickets(0, 0);

    this.currentRol = localStorage.getItem('type_user');
  }

    /**
   * La función calcula la cantidad de elementos que pueden caber en una página y establece un mínimo de
   * 2 elementos por página.
   */


  /**
   * Obtiene los tickets del backend
   * @param category categoria del ticket
   * @param status Estado del ticket
   */
  getTickets(category, status) {
    this.loading = true;
    if (category == "") {
      category = 0
    }
    if (status == "") {
      status = 0
    }

    if (status != 0) {
      this.nameFilterStatus = "Eliminar filtro"
      document.getElementById('optionDefaultStatus').removeAttribute('hidden')
    } else {
      this.nameFilterStatus = "Estados";
      document.getElementById('optionDefaultStatus').setAttribute('hidden', 'true')
    }


    if (category != 0) {
      this.nameFilterCategory = "Eliminar filtro"
      document.getElementById('optionDefaultCurrency').removeAttribute('hidden')
    } else {
      this.nameFilterCategory = "Categorias";
      document.getElementById('optionDefaultCurrency').setAttribute('hidden', 'true')
    }

  

    this.supportService.filterTickets(category, status).subscribe(
      data => {
        this.loading = false;
        this.listTickets = <Tickets[]>data;
      },
      error => {
        this.loading = false;
      }
    )
  }

  /**
   * Obtiene los posibles estados de un ticket
   */
  getStatus() {
    this.supportService.ListStatus().subscribe(
      data => {
        this.statusPqrs = <[]>data;
      },
      error => {

      }
    )
  }

 
/**
 * Cambia el estado de un ticket, confirma el cambio con un modal, al cerrar el modal, cambia el estado del ticket en la lista de tickets.

 * @param idPqrs - la identificación del boleto
 * @param status - cuerda
 */
  changeStatusTicket(idPqrs,  status){
    Swal.fire({
      text: this.translate.instant("¿Desea cerrar este ticket?"),
      icon: 'question',
      confirmButtonColor: '#000',
      confirmButtonText:this.translate.instant("Si"),
      cancelButtonText: this.translate.instant("No"),
      showCancelButton: true,
    }).then((action) => {
      if (action.isConfirmed){
        this.supportService.finishedPqrs(idPqrs).subscribe(
          data => {
            let result:any = data;
            Swal.fire({
              title: this.translate.instant("Ticket cerrado"),
              icon: 'success',
              confirmButtonColor: '#000',
            }).then(action => {
              this.listTickets.forEach(element => {
                if(element.id_pqrs == idPqrs){
                  element.status="Cerrado";
                }
              });
            })
          },
          error => {
            Swal.fire({
              title: this.translate.instant("Ha ocurrido un error"),
              icon: 'error',
              confirmButtonColor: '#000',
            })
          }
         
        )
      }
    })
    
  }

  /**
   * Obtiene los permisos del suario en sesión
   * @param e 
   */
  getPermits(e) {
    this.Permits = e;
  }


/**
 * La función abre una ventana modal con el contenido que se le pasa.
 * @param content - El contenido del modal. Puede ser una variable de referencia de plantilla, un
 * componente, una cadena de HTML o una promesa.
 */
  openModal(content) {
      this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title', windowClass: 'newZone', size: 'lg' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

/**
 * Abre el explorador de archivos cuando el usuario hace clic, para cargar una imagen.
 */
  openExplore() {
    document.getElementById('input_img').click();
  }

/**
 * Toma el archivo de la entrada, lo convierte en una cadena base64 y luego lo empuja a una matriz.
 * @param e - el evento que se desencadena cuando el usuario selecciona un archivo.
 */
  loadImg(e) {
    this.base64textString = [];
    this.showToast = false;
    if (e == "") {
      this.showToast = false;
    } else {
      const target = e.target as HTMLInputElement;
      const file = target.files[0];
      this.nameCurrentImg = file.name;
      if (file) {
        const reader = new FileReader();
        this.showToast = true;
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    }
  }

/**
 * Convierte la imagen al formato base64.
 * @param e - el objeto del evento
 */
  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.current_img = this.base64textString[0];
  }

  /**
   * Obtiene las posibles categorias de un ticket
   */
  ObtainCategories() {
    this.supportService.listGategories().subscribe(
      data => {
        this.categories = <[]>data;
      },
      error => {
      }
    )
  }

  /**
   * Guarda un nuevo ticket
   */
  saveNewTicket() {
    this.loading_spinner = true;
    if (this.nameNewTicket.trim() != "" && this.typeNewTicket.trim() != "") {
      let data = {
        "name": this.nameNewTicket,
        "type": this.typeNewTicket
      }
      this.supportService.createTicket(data).subscribe(
        data => {
          document.getElementById('closeModal').click()
          let result: any = data;
          let id_ticket = result.id_tickets;
          this.router.navigate(['support/chat/' + id_ticket + "/" + this.nameNewTicket]);
        },
        error => {

        }
      )
    } else {
      // console.log(this.nameNewTicket , " " , this.typeNewTicket)
      this.loading_spinner = false;
      Swal.fire({
        title: this.translate.instant("¡Advertencia!"),
        text: this.translate.instant("Por favor llena todos los datos"),
        icon: 'warning',
        confirmButtonColor: '#000',
      })

    }
  }

/**
 * Es una función que toma un motivo como parámetro y devuelve una cadena.
 * @param {any} reason - any - La razón por la que se descartó el modal.
 * @returns El motivo por el que se cerró el modal.
 */
  private getDismissReason(reason: any): string {
    this.loading_spinner = false;
    this.nameNewTicket = "";
    this.typeNewTicket = "";
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
