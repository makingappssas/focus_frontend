import { Component, ElementRef, OnInit } from '@angular/core';
import { auto } from '@popperjs/core';
import { ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Params } from '@angular/router';
import { SupportService } from 'src/app/services/support.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageTickets } from 'src/app/interfaces/message-tickets';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('chat') chat: ElementRef;

  


  currentMessage = "";
  current_img:any = "";
  base64textString = "";
  showToast = false;
  imgBig = "";
  closeResult: string;
  currentTicket;
  currentTicketName;
  messages: MessageTickets[] = [];
  currentAuthor = "PWC";
  loading = true;
  activeTicket = true;
  imageFile;
  constructor(private _location: Location,
    private _route: ActivatedRoute,
     private sanitizer: DomSanitizer,
    private translate: TranslateService,
    private supportService: SupportService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.currentTicket = this._route.snapshot.paramMap.get('id');

    //console.log("Nombre del Ticket: ", this._route.snapshot.paramMap.get('name'))
    if (this._route.snapshot.paramMap.get('name') != undefined) {
      this.currentTicketName = this._route.snapshot.paramMap.get('name');
      this.stylezarTicketName();
    }
    this._route.params.subscribe((params: Params) => {
      this.currentTicket = +params['id']; // Obtener el id del chat de la ruta
      // Lógica de actualización del chat utilizando el nuevo chatId
      // Aquí puedes hacer una llamada a tu servicio para obtener la información del chat
      this.getMessage(this.currentTicket);
    });
    let nameAuthor = localStorage.getItem('username');
    let a = nameAuthor.split(' ');
    this.currentAuthor = a[0];
    if (this.currentAuthor == "SUPER") {
      this.currentAuthor = "PWC";
    }
  }


  ngAfterViewInit() {
    if (document.documentElement.scrollWidth < 500) {
      window.addEventListener("load", function() { 
        window.scrollTo(0, 100); 
      });
    }
    setTimeout(() => {
      const divElement: HTMLElement = this.chat.nativeElement;
      divElement.scrollTop = divElement.scrollHeight;
    }, 1200);

  }

/**
 * Si el ancho de la pantalla es inferior a 900 px y el nombre del ticket tiene más de 20 caracteres,
 * reduzca el nombre del ticket a 20 caracteres y agregue puntos suspensivos. 
 * Si el ancho de la pantalla es inferior a 1400 px y el nombre del ticket tiene más de 15 caracteres, reduzca el nombre
 * del ticket a 15 caracteres y agregue puntos suspensivos. 
 * Si el ancho de la pantalla es inferior a 426 px y el nombre del ticket tiene más de 8 caracteres, reduzca el nombre del ticket a 8 caracteres
 * y agregue puntos suspensivos. 
 * Si el ancho de la pantalla es superior a 1400 px y el nombre del ticket tiene más de 30 caracteres, reduzca el nombre del ticket a 30 caracteres y agregue puntos
 * suspensivos.
 */


  stylezarTicketName(){
    if (document.documentElement.scrollWidth < 900) {
      if (document.documentElement.scrollWidth < 426) {
        if(this.currentTicketName?.length > 8){
          this.currentTicketName = this.currentTicketName.substring(0,8) + "..."
        }
      }else{
        if(this.currentTicketName?.length > 20){
          this.currentTicketName = this.currentTicketName.substring(0,20) + "..."
        }
      }
    } else {
      if (document.documentElement.scrollWidth < 1400) {
        if(this.currentTicketName?.length > 15){
          this.currentTicketName = this.currentTicketName.substring(0,15) + "..."
        }
      }else{
        if(this.currentTicketName?.length > 30){
          this.currentTicketName = this.currentTicketName.substring(0,30) + "..."
        }
      }
    }
  }

/**
 * Recibe los mensajes de un ticket y si el ticket está cerrado deshabilita el área de texto y el botón
 * para enviar el mensaje.
 * @param id - la identificación del ticket
 */
  getMessage(id) {
    this.supportService.getMessagesFromATicket(id).subscribe(
      data => {
        let result: any = data;
        if(result.name_chat != undefined){
          this.currentTicketName = result.name_chat;
          this.stylezarTicketName();
        }
        this.messages = <MessageTickets[]>result.message;
        if (this.messages == undefined) {
          this.messages = [];
        }
        if (result.status_pqrs == 3) {
          this.activeTicket = false;
          document.getElementById("textareaMessage").setAttribute('disabled', 'true');
          document.getElementById("textareaMessage").setAttribute('placeholder', this.translate.instant('Este ticket ya esta cerrado'));
          document.getElementById("buttonLoadImg").setAttribute('disabled', 'true');
          document.getElementById("buttonSendMessage").setAttribute('disabled', 'true');
        }
        setTimeout(() => {
          let a = document.getElementById('cont_chat')
          a.scrollTop = 9999;
        }, 20);
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    )
  }


/**
 * La función back() se utiliza para volver a la página anterior.
 */
  back() {
    this._location.back();
  }

/**
 * Es una función que, cuando se llama, activará un evento de clic en el elemento con la identificación
 * de 'load_img'.
 */
  clickLoadImg() {
    document.getElementById('load_img').click();
  }

/**
 * Toma el archivo de la entrada, lo convierte en una cadena binaria y luego llama a la función
 * handleReaderLoaded. Lo que se hace es obtener la informacion de la imagen cargada por un input type file
 * @param e - el evento que se desencadena cuando el usuario selecciona un archivo
 */
  loadImg(e) {
    this.showToast = false;
    if (e == "") {
      this.showToast = false;
    } else {
      // const target = e.target as HTMLInputElement;
      const file = e.target.files[0];
      this.imageFile = e.target.files[0];
      this.current_img = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(e.target.files[0]));
    }
  }
  
/**
 * Se agrega un mensaje en el chat
 */
  addMessage($event?) {
    /* Prevención de la acción predeterminada del evento. */
    $event?.preventDefault()
    // console.log("Mensaje: " ,  this.currentMessage , " Imagen: ", this.current_img )
    if (this.currentMessage.trim() != "" || this.current_img.toString().trim() != "") {
      /* Adición de un nuevo mensaje a la matriz de messages. */
      this.messages.push(
        {
          id_pqrs: this.currentTicket,
          author: this.currentAuthor,
          contents: this.currentMessage,
          img: this.current_img
        }
      )
      // GUARDAR MENSAJES UNO POR UNO
      /* Verificando si el mensaje actual está vacío y si lo está, lo está configurando como nulo. */
      if (this.currentMessage == "") {
        this.currentMessage = null;
      }
      /* Establecer current_img en nulo si está vacío. */
      if (this.current_img == "") {
        this.current_img = "null"
      }
      let data = {
        "id": this.currentTicket,
        "author": this.currentAuthor,
        "contents": this.currentMessage,
        "img":  this.imageFile
      }
      this.supportService.addMessage(data).subscribe(
        data => {

        },
        error => {

        }
      )
      /* Configurando currentMessage y current_img en cadenas vacías y luego desplazándose el chat a la parte final. */
      setTimeout(() => {
        this.currentMessage = "";
        this.current_img = "";
        this.imageFile = undefined;
        let a = document.getElementById('cont_chat')
        a.scrollTop = 9999;
        this.limpiarInput()
      }, 20);
    }

  }



/**
 * Borra el elemento de entrada, establece la imagen actual en una cadena vacía, establece
 * base64textString en una cadena vacía y luego llama a la función loadImg con una cadena vacía.
 */
  limpiarInput() {
    
    this.current_img = "";
    this.base64textString = "";
    this.loadImg("")
  }

/**
 * Limpia la variable que contiene la imagen actual
 */
  cleanImgPrev(){
    this.current_img = "";
    this.base64textString = "";
    this.loadImg("")
  }

/**
 * La función abre una ventana modal con el contenido que se le pasa.
 * @param content - el contenido modal
 * @param [img] - la imagen que se mostrará en el modal
 */
  openModal(content, img?) {
    if (img != undefined)
      this.imgBig = img;
    this.modalService.open(content, { centered: true, windowClass: 'modalBig' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


/**
 * Si el usuario presiona la tecla ESC, regresa 'presionando ESC'. Si el usuario hace clic en el fondo,
 * devuelve 'haciendo clic en un fondo'. De lo contrario, devuelva 'con: ' + motivo.
 * @param {any} reason - any - La razón por la que se descartó el modal.
 * @returns El motivo por el que se cerró el modal.
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
