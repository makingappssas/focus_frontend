import { Component } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
// import { IdAndName } from 'src/app/interfaces/id-and-name';
import { AcademyService } from 'src/app/services/academy.service';
// import { ResourcesService } from 'src/app/services/resources.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss']
})
export class AcademyComponent {
  rol_user;
  closeResult: string;
  actual_view = "cont-btns";
  type_profile = [];
  type_resource = [];
  current_lang_for_filter = "all";
  resources = [];
  nameFilterProfile = ""
  page = 1;
  pageSize = 6;
  currentType_resource = "docs";
  current_profile = "0";
  type_file = "";
  loading = false;
  nameFilterTypeFile;
  nameFilterLan;
  id_file_edit: any;

  currentData;
  id_video;
  title_view = "";

  videos_of_courses = [];
  current_course: string = "";
  current_id_course: string;
  name_button_add: string;
  urlCurrentVideo: any;


  constructor(private modalService: NgbModal,
    private translate: TranslateService,
    private academyService: AcademyService) {

  }

  ngOnInit() {

    this.suscribeLanguageChange();

    this.nameFilterProfile = "Filtrar por perfil";
    this.nameFilterTypeFile = "Filtrar por archivo";
    this.nameFilterLan = "Filtrar por lenguaje"
    this.rol_user = localStorage.getItem('type_user');
    let currentView = localStorage.getItem('currentViewResource')
    switch (currentView) {
      case 'docs':
        document.getElementById('btn-view-docs').click();
        break;
      case '5':
        document.getElementById('btn-view-video').click();
        break;
      case '6':
        document.getElementById('btn-view-image').click();
        break;
      default:
        break;
    }
    this.getTypes();
  }

  /**
   * Se suscribe a el cambio de lenguaje y en base a esto se consultan los datos que se estan mostrando en la vista actual
   */
  suscribeLanguageChange() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      // this.current_lang_for_filter = event.lang;
      let view = localStorage.getItem('currentViewResource');
      setTimeout(() => {
        this.getResources(view);
        if(this.name_button_add == 'Agregar video'){ //Esta mirando el contenido de un curso
          this.backView(this.actual_view); // lo devolvemos a la vista de los cursos
        }
      }, 100);
    });
  }


  /**
   * Abre un modal
   * @param content contenido a mostrar en el modal
   * @param class_name clase del componente del modal
   */
  openModal(content, class_name, id_file?) {
    if (id_file != undefined) {
      this.id_file_edit = id_file;
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'modal-file ' + this.type_file + ' ' + class_name }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /**
   * Muestra un modal de previsualización
   * @param content contenido del modal
   * @param class_name clase del modal
   * @param preview variables necesarias 
   */
  openModalPreview(content, class_name, preview) {
    // console.log("preview: ", preview)
    this.currentData = preview;
    if (class_name == "view-video") {
      this.urlCurrentVideo = preview.url;
    } else {
      this.id_video = undefined;
    }


    // console.log("Preview DAta: ", this.currentData)
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'modal-file video-academy ' + this.type_file + ' ' + class_name }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /**
   * Muestra la vista donde se visualizan los videos
   * @param id Id del curso
   * @param name_course Nombre del curso
   */
  viewListVideo(id, name_course?) {
    this.current_id_course = id;
    this.current_course = name_course;
    this.getVideos(id);
    this.name_button_add = "Agregar video"
    // Ocultamos la vista de cursos y mostramos la vista de videos
    this.type_file = "video"
    document.getElementById('container-courses')?.classList.remove('animate__bounceInRight')
    document.getElementById('container-courses')?.classList.add('animate__backOutLeft')
    setTimeout(() => {
      document.getElementById('container-courses').classList.add('d-none')
      document.getElementById('cont-video').classList.remove('d-none')
      document.getElementById('cont-video').classList.add('animate__bounceInRight')
      this.actual_view = 'cont-video';
    }, 400);
  }

  /**
   * Obtiene un listado de videos dependiendo del curso seleccionado
   * @param id Id de el curso
   */
  getVideos(id) {
    this.academyService.getVideosOfCourse(id).subscribe(
      data => {
        let result: any = data;
        this.videos_of_courses = result.data
      },
      error => {
        Swal.fire({
          text: this.translate.instant('Error al obtener los videos'),
          icon: 'error',
          confirmButtonColor: '#000'
        })
      }
    )
  }



  /**
 * Muestra el detalle del documento en una alerta
 * @param title titulo del audio
 * @param description descripción del audio
 */
  showDetailAudio(title, description) {
    Swal.fire({
      title: this.translate.instant('Sobre este audio'),
      html: '' +
        '<div class="detail-audio-swal">' +
        '<p class="title text-bold">' + this.translate.instant('Título') + ':</p>' +
        '<p class="cont">' + title + '</p>' +

        '<p class="title text-bold description">' + this.translate.instant('Descripción') + ':</p>' +
        '<p class="cont">' + description + '</p>' +
        '</div>',
      showCloseButton: true,
      showConfirmButton: false
    })
  }

  /**
   * Muestra el detalle del documento en una alerta
   * @param title titulo del documento
   * @param description descripción del documento
   */
  showDetailDocument(title, description) {
    Swal.fire({
      title: this.translate.instant('Sobre este documento'),
      html: '' +
        '<div class="detail-audio-swal">' +
        '<p class="title text-bold">' + this.translate.instant('Título') + ':</p>' +
        '<p class="cont">' + title + '</p>' +

        '<p class="title text-bold description">' + this.translate.instant('Descripción') + ':</p>' +
        '<p class="cont">' + description + '</p>' +
        '</div>',
      showCloseButton: true,
      showConfirmButton: false
    })
  }
  /**
   * Toma tres parámetros, el título, la fuente de audio y el autor, y luego muestra una dulce alerta con
   * el título, la fuente de audio y el autor.
   * @param title - El título del audio.
   * @param audio - el archivo de audio
   * @param author - el autor del audio
   */


  /**
   * Toma tres parámetros, el título, la fuente de audio y el autor. Luego crea un Swal.fire() con el
   * título, la fuente de audio y el autor.
   * Rreproduce el audio al que se le dio click
   * @param title - El título del audio.
   * @param audio - el archivo de audio
   * @param author - el autor del audio
   */
  playAudio(title, audio, author) {
    Swal.fire({
      title: title,
      html: '' +
        '<audio controls autoplay class="audio-swall">' +
        '<source src="' + audio + '">' +
        '</audio>' +
        '<p class="author-swall">Author: <span>' + author + '</span></p>',
      showCloseButton: true,
      showConfirmButton: false
    })
  }

  /**
   * Elimina un curso
   * @param id id del curso
   */
  deleteCourse(id) {
    Swal.fire({
      text: this.translate.instant('¿Estas seguro de eliminar este curso?, se eliminaran todos los videos que contenga'),
      confirmButtonColor: '#000',
      confirmButtonText: this.translate.instant('Si, eliminar'),
      cancelButtonText: this.translate.instant('Cancelar'),
      showCancelButton: true,
      icon: 'question'
    }).then((action) => {
      if (action.isConfirmed) {
        this.academyService.deleteCourse(id).subscribe(
          data => {
            Swal.fire({
              text: this.translate.instant('Curso eliminado correctamente'),
              icon: 'success',
              confirmButtonColor: '#000'
            }).then(() => {
              this.filterResources();
            })
          },
          error => {
            Swal.fire({
              text: this.translate.instant('Ha ocurrido un error, inténtalo más tarde'),
              icon: 'error',
              confirmButtonColor: '#000'
            })
          }
        )
      }
    })
  }

  /**
   * Elimina un documento
   * @param id id del documendo
   */
  deleteDocument(id) {
    Swal.fire({
      text: this.translate.instant('¿Estas seguro de eliminar este archivo?'),
      confirmButtonColor: '#000',
      confirmButtonText: this.translate.instant('Si, eliminar'),
      cancelButtonText: this.translate.instant('Cancelar'),
      showCancelButton: true,
      icon: 'question'
    }).then((action) => {
      if (action.isConfirmed) {
        this.academyService.deleteFile(id).subscribe(
          data => {
            Swal.fire({
              text: this.translate.instant('Archivo eliminado correctamente'),
              icon: 'success',
              confirmButtonColor: '#000'
            }).then(() => {
              this.filterResources();
            })
          },
          error => {
            Swal.fire({
              text: this.translate.instant('Ha ocurrido un error, inténtalo más tarde'),
              icon: 'error',
              confirmButtonColor: '#000'
            })
          }
        )
      }
    })
  }

  /**
   * Realiza un cambio de vista
   */
  changeActualView(new_view) {
    // console.log("Vista actual: ", new_view)
    this.showView(new_view);
  }

  /**
   * Obtiene los tipos de perfiles y recursos
   */
  getTypes() {
    this.academyService.getTypesResourcesAndProfiles().subscribe(
      data => {
        this.type_profile = <[]>data.data.types_profile;
        this.type_resource = <[]>data.data.types_resource;
      },
      error => {
        // console.log("Error al obtener los datos")
      }
    )
  }

  /**
   * Metodo para filtrar los recursos
   */
  filterResources() {
    this.type_file = this.currentType_resource;
    this.getResources(this.currentType_resource)
  }

  /**
   * Obtiene los recursos
   * @param profile_resource 		{
        "id": 1,
        "name": "Networker"
      },
      {
        "id": 2,
        "name": "Universitarios"
      },
      {
        "id": 3,
        "name": "Ambientalistas"
      },
      {
        "id": 4,
        "name": "Empresarios"
      }
   * @param type_resource si es docs traera todos los documentos
   * 		"types_resource": [
      {
        "id": 1,
        "name": "pdf"
      },
      {
        "id": 2,
        "name": "doc"
      },
      {
        "id": 3,
        "name": "xlsx"
      },
      {
        "id": 4,
        "name": "ppt"
      },
      {
        "id": 5,
        "name": "video"
      },
      {
        "id": 6,
        "name": "imagen"
      }
    ]
   */
  getResources(type_resource) {
    this.loading = true;

    if (this.currentType_resource != "docs") {
      this.nameFilterTypeFile = "Eliminar filtro";
      document.getElementById('filterTypeFileOption')?.removeAttribute('hidden')
    } else {
      this.nameFilterTypeFile = "Filtrar por archivo";
      document.getElementById('filterTypeFileOption')?.setAttribute('hidden', 'hidden')
    }

    if (this.current_lang_for_filter != "all") {
      this.nameFilterLan = "Eliminar filtro";
      document.getElementById('filterLang')?.removeAttribute('hidden')
    } else {
      this.nameFilterLan = "Filtrar por lenguaje";
      document.getElementById('filterLang')?.setAttribute('hidden', 'hidden')
    }

    let data = {
      "language": this.current_lang_for_filter,
      // "profile": profile_resource,
      "type_resource": type_resource
    }
    // console.log("Data a enviar: ", data)
    this.academyService.getResources(data).subscribe(
      data => {
        let result: any = data;
        this.resources = result.data;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    )
  }
  /**
   * Este evento es emitido desde el modal de creación de archivos, y es para cerrar el modal
   * @param $event si es true recargara la tabla
   */
  eventCloseModal($event) {
    this.id_file_edit = undefined;
    document.getElementById('closeModal').click();
    if ($event == 'video') {
      this.getVideos(this.current_id_course);
    } else {
      this.getResources($event);
    }

  }


  /**
   * Elimina un vide
   * @param id id del video
   */
  deleteVideo(id) {
    Swal.fire({
      text: this.translate.instant('¿Estas seguro de eliminar este video?'),
      confirmButtonColor: '#000',
      confirmButtonText: this.translate.instant('Si, eliminar'),
      cancelButtonText: this.translate.instant('Cancelar'),
      showCancelButton: true,
      icon: 'question'
    }).then((action) => {
      if (action.isConfirmed) {
        this.academyService.deleteVideo(id).subscribe(
          data => {
            Swal.fire({
              text: this.translate.instant('Video eliminado correctamente'),
              icon: 'success',
              confirmButtonColor: '#000'
            }).then(() => {
              this.videos_of_courses.forEach((element, index) => {
                if (element.id == id) {
                  this.videos_of_courses.splice(index, 1)
                }
              });
            })
          },
          error => {
            Swal.fire({
              text: this.translate.instant('Ha ocurrido un error, inténtalo más tarde'),
              icon: 'error',
              confirmButtonColor: '#000'
            })
          }
        )
      }
    })
  }

  /** 
 * Es el que permite volver al menú de los botones en el apartado de configuraciones
 * @param reason es el formulario en acción
 */
  backView(reason) {
    //DESACTIVAMOS FILTROS Y RESTABLECEMOS VALORES
    this.current_lang_for_filter = "all";
    this.currentType_resource = "docs";
    this.current_profile = "0";


    if (this.actual_view == 'cont-video') { //Estamos en la vista de los videos, asi que el boton atras llevara a la vista de cursos
      this.actual_view = "container-courses";
      this.name_button_add = "Agregar curso";
      this.title_view = "Cursos";
      this.current_course = "";
      this.current_id_course = null;
      this.type_file = '5';
      document.getElementById('container-courses')?.classList.remove('animate__backOutLeft')

      document.getElementById('cont-video').classList.remove('animate__bounceInRight')
      document.getElementById('cont-video').classList.add('animate__backOutRight')
      setTimeout(() => {
        document.getElementById('cont-video').classList.add('d-none')
        document.getElementById('container-courses').classList.remove('d-none')
        document.getElementById('container-courses').classList.add('animate__bounceInLeft')
      }, 400);

    } else {
      this.actual_view = "cont-btns";

      document.getElementById('container-courses')?.classList.remove('animate__bounceInLeft')


      localStorage.removeItem('currentViewResource')
      document.getElementById('cont-page')?.classList.remove('cont-table')

      document.getElementById(reason).classList.remove('animate__bounceInRight')
      document.getElementById(reason).classList.add('animate__backOutRight')

      document.getElementById('header_all_bodys').classList.remove('animate__bounceInRight')
      document.getElementById('header_all_bodys').classList.add('animate__backOutRight')

      setTimeout(() => {
        document.getElementById(reason).classList.add('d-none')
        document.getElementById('header_all_bodys').classList.add('d-none')
        document.getElementById('cont-btns').classList.remove('d-none')
        document.getElementById('cont-btns').classList.add('animate__bounceInLeft')
      }, 400);
    }

  }
  ngOnDestroy() {
    // console.log('Vista destruida')
    document.getElementById('cont-page')?.classList.remove('cont-table')
    localStorage.removeItem('currentViewResource')
  }
  /**
* Es el encargado de mostrar las distintas vistas
* 
* @param {string} view - cadena
*/
  showView(view: string) {
    document.getElementById('cont-page')?.classList.add('cont-table')
    switch (view) {
      case 'cont-documents':
        this.name_button_add = "Agregar documento";
        this.title_view = "Documentos";
        this.type_file = "docs";
        this.currentType_resource = "docs";
        localStorage.setItem('currentViewResource', this.type_file)
        this.getResources(this.currentType_resource);
        break;
      case 'container-courses':
        this.name_button_add = "Agregar curso";
        this.title_view = "Cursos";
        this.type_file = "5"; //con este id se condultan todos los cursos
        this.currentType_resource = this.type_file;
        localStorage.setItem('currentViewResource', this.type_file)
        this.getResources(this.type_file);
        break;
      // case 'cont-video':
      //   this.type_file = "5";
      //   this.currentType_resource =  this.type_file;
      //   localStorage.setItem('currentViewResource', this.type_file)
      //   this.getResources(0, this.type_file);
      //   break;
      case 'cont-audio':
        this.title_view = "Podcast";
        this.name_button_add = "Agregar audio"
        this.type_file = "6";
        this.currentType_resource = this.type_file;
        localStorage.setItem('currentViewResource', this.type_file)
        this.getResources(this.type_file);
        break;
      default:
        break;
    }

    document.getElementById(view)?.classList.remove('animate__backOutRight')


    document.getElementById('cont-btns')?.classList.remove('animate__bounceInLeft')
    document.getElementById('cont-btns').classList.add('animate__backOutLeft')
    setTimeout(() => {
      document.getElementById('cont-btns').classList.add('d-none')

      document.getElementById('header_all_bodys').classList.remove('d-none')
      document.getElementById('header_all_bodys').classList.add('animate__bounceInRight')

      document.getElementById(view).classList.remove('d-none')
      document.getElementById(view).classList.add('animate__bounceInRight')
      this.actual_view = view;
    }, 400);

  }


  /**
  * Cierra el modal
  * @param {any} reason - alguna - El motivo del despido.
  * @returns El motivo por el que se cerró el modal.
  */
  private getDismissReason(reason: any): string {
    this.id_file_edit = undefined;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
