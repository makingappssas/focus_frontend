import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AcademyService } from 'src/app/services/academy.service';
import { ResourcesService } from 'src/app/services/resources.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load-files-academy',
  templateUrl: './load-files-academy.component.html',
  styleUrls: ['./load-files-academy.component.scss']
})
export class LoadFilesAcademyComponent {
  type_profile = [];
  type_resource = [];
  formFiles: FormGroup;
  @Input() type_file = "";
  @Output() closeModal = new EventEmitter<any>();
  text_input_file = ""
  sizekiloBytes: number;
  documento: string | ArrayBuffer;
  load_file: boolean;
  icon_input_file;
  loading_spinner = false;
  accept_docs = ""
  show_icon_docs = false;
  title_view = "Cargar archivo"
  @Input() id_file: any;
  @Input() id_course: any;
  currentImg = null;
  id_current_video;
  file_for_audio: File;
  duration: number;
  duracion_completa_audio: string;
  src_audio = null;
  videoFile: any;
  imageFile;

  constructor(private academyService: AcademyService,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.getTypes();
    this.text_input_file = "+ " + this.translateService.instant('Subir archivo')
    // this.accept_docs = "application/.pdf, .doc, .docx, .odf, .pptx, .pptx, .xlsx, .pdf, vnd.openxmlformats-officedocument.spreadsheetml.sheet, vnd.ms-excel";
    // console.log("ID Archivo: ", this.id_file)


    this.createForm();
    if (this.id_file != 0) {
      //SE VA A EDITAR UN ARCHIVO
      if (this.type_file != '5' && this.type_file != '6' && this.type_file != 'video') {
        this.title_view = "Editar documento";
        this.getFileById(this.id_file)
      } else if (this.type_file == '5') {
        this.title_view = "Editar curso";
        this.getFileById(this.id_file)
      } else if (this.type_file == '6') {
        this.title_view = "Editar audio";
        this.getFileById(this.id_file)
      } else if (this.type_file == 'video') {
        this.title_view = "Editar Video";
        this.getVideoById(this.id_file)
      }



    } else {

    }
  }


  /**
   * Crea un formulario dependiendo de lo que se va a crear o editar
   */
  createForm() {
    if (this.type_file != '5' && this.type_file != '6' && this.type_file != 'video') {
      this.title_view = "Agregar documento";
      this.formFiles = this.formBuilder.group({
        title: ['', [Validators.required]],
        language: ['', [Validators.required]],
        description: ['', [Validators.required]],
        type_resource: ['', [Validators.required]],
        file: ['', [Validators.required]]
      })
    } else if (this.type_file == '5') { // va a agregar un curso
      this.title_view = "Agregar curso";
      this.formFiles = this.formBuilder.group({
        title: ['', [Validators.required]],
        language: ['', [Validators.required]],
        type_resource: ['', [Validators.required]],
        description: ['', [Validators.required]],
        img: ['', [Validators.required]],
      })
      this.formFiles.get('type_resource').setValue('5')
    } else if (this.type_file == 'video') { // va a agregar un video
      this.title_view = "Agregar video";
      this.text_input_file = 'Portada del video'
      this.formFiles = this.formBuilder.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        img: ['', [Validators.required]],
        file: ['', [Validators.required]]
      })
    } else if (this.type_file == '6') {
      this.title_view = "Agregar audio";

      this.formFiles = this.formBuilder.group({
        title: ['', [Validators.required]],
        author: ['', [Validators.required]],
        language: ['', [Validators.required]],
        type_resource: ['', [Validators.required]],
        description: ['', [Validators.required]],
        file: ['', [Validators.required]]
      })
      this.accept_docs = 'audio/*';
      this.formFiles.get('type_resource').setValue('6')
    }
  }

  /**
   * Se llama cuando se va a editar un archivo, crea y llena el formulario especifivo para el tipo de archivo a editar
   * @param id id del archivo a editar
   */
  getFileById(id) {
    this.academyService.getFileById(id).subscribe(
      data => {
        let result: any = data
        this.setIconFile(result.data.type_file)
        if (this.type_file != '5' && this.type_file != '6' && this.type_file != 'video') { // se va a editar un documento
          this.text_input_file = result.data.title.trim() + "." + result.data.type_file.toLowerCase()

          this.formFiles = this.formBuilder.group({
            title: [result.data.title, [Validators.required]],
            language: [result.data.language, [Validators.required]],
            description: [result.data.description, [Validators.required]],
            type_resource: ['' + result.data.type_document, [Validators.required]], // lo convierto a string para poder enviarlo y validarlo en el metodo de typeFileUpload
            file: [result.data.resource, [Validators.required]]
          })
          this.formFiles.get('file').setValue('value load');
          this.typeFileUpload();
          this.formFiles.get('type_resource').disable(); // Deshabilitamos la opcion de cambiar de tipo de recurso, esto no se puede editar
        } else if (this.type_file == '5') {
          this.formFiles = this.formBuilder.group({
            title: [result.data.title, [Validators.required]],
            language: [result.data.language, [Validators.required]],
            type_resource: [result.data.type_document, [Validators.required]],
            description: [result.data.description, [Validators.required]],
            img: [result.data.img, [Validators.required]],
          })

          this.currentImg = result.data.img;
          this.text_input_file = result.data.title + ".png";
          this.formFiles.get('type_resource').setValue('5')
        } else if (this.type_file == '6') {
          this.formFiles = this.formBuilder.group({
            title: [result.data.title, [Validators.required]],
            author: [result.data.author, [Validators.required]],
            language: [result.data.language, [Validators.required]],
            type_resource: [result.data.type_resource, [Validators.required]],
            description: [result.data.description, [Validators.required]],
            file: [result.data.document, [Validators.required]]
          })

          this.text_input_file = result.data.title + ".mp3";
          this.formFiles.get('type_resource').setValue('6')
        }
      },
      error => {

      }
    )
  }

  /**
   * Obtiene los datos de un video y crea un formulario con esta información
   * @param id id del video
   */
  getVideoById(id) {
    this.academyService.getVideoById(id).subscribe(
      data => {
        let result: any = data
        this.id_current_video = result.data.id
        this.formFiles = this.formBuilder.group({
          title: [result.data.title, [Validators.required]],
          description: [result.data.description, [Validators.required]],
          img: [result.data.img, [Validators.required]],
          file: ['']
        })
        this.currentImg = result.data.img;
        this.text_input_file = result.data.title + ".png"

      },
      error => {

      }
    )
  }

  /**
   * Si el usuario hace clic en el elemento input_file, primero debe seleccionar un tipo de archivo. Si
   * el usuario no ha seleccionado un tipo de archivo, se le solicita que seleccione un tipo de archivo.
   * Si el usuario ha seleccionado un tipo de archivo, entonces el usuario puede seleccionar un archivo.
   * @param id - id del archivo de entrada
   */
  clickId(id) {
    if (id == 'input_file') {
      //Esta intentando cargar un archivo
      if (this.formFiles.get('type_resource').value == "" ||
        this.formFiles.get('type_resource').value == undefined ||
        this.formFiles.get('type_resource').value == null) {
        Swal.fire({
          text: this.translateService.instant('Primero debes seleccionar el tipo de archivo a subir'),
          confirmButtonColor: '#000',
          icon: 'info'
        }).then(() => {
          this.formFiles.get('type_resource').markAsTouched();
        })
      } else {
        document.getElementById(id)?.click();
      }
    } else {
      document.getElementById(id)?.click();
    }

  }


  /**
   * Valida la cantidad de digitos de la descripción
   */
  descriptionLength() {
    let amount_caracter = 90;
    if (this.type_file == 'video') {
      amount_caracter = 400;
    }

    let description = this.formFiles.get('description').value;
    if (description != undefined &&
      description != null &&
      description != "") {
      if (description.length > amount_caracter) {
        let a = description.toString().substring(0, amount_caracter)
        this.formFiles.get('description').setValue(a)
      }
    }

  }

  /**
   * Obtiene los tipos de recursos y perfiles
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
   * Dependiendo del tipo de archivo selccionado se permitira mostrar archivos en el explorador,
   * es decir si selcciona pdf solo se mostraran archivos .pdf para subir
   */
  typeFileUpload() {
    let type = this.formFiles.get('type_resource').value;
    switch (type) {
      case '1':
        //pdf
        this.accept_docs = "application/.pdf, .pdf"
        break;
      case '2':
        //word
        this.accept_docs = "application/.doc, .doc, .docx"
        break;
      case '3':
        //excel
        this.accept_docs = ".xlsx, vnd.openxmlformats-officedocument.spreadsheetml.sheet, vnd.ms-excel"
        break;
      case '4':
        //Powert Point
        this.accept_docs = "pptx, .pptx"
        break;

      default:
        break;
    }
  }


  //procesar archivo especifico del modal de crear archivo subido desde la vista en base64
  detectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      // console.log(event.target.files)
      var sizeByte = event.target.files[0].size;
      var tipoFIle = event.target.files[0].type;
      var nameFile = event.target.files[0].name;
      if (this.verifyFile(nameFile)) {

        if (this.type_file == '6') {
          // OBTENIENDO DURACIÓN
          let files: FileList = event.target.files;
          if (files.length > 0) {
            this.file_for_audio = files[0];
          }
          if (this.file_for_audio.name.match(/\.(avi|mp3|mp4|mpeg|ogg)$/i)) {
            let obUrl = URL.createObjectURL(this.file_for_audio);
            this.src_audio = obUrl;
            // document.getElementById("audio").setAttribute('src', obUrl);
          }
          // Fin obtener duración
        }

        this.formFiles.get('type_resource')?.disable();
        this.sizekiloBytes = parseFloat(sizeByte) / 1024
        // console.log("Size file: ", this.sizekiloBytes)
        if (this.sizekiloBytes > 49000) {
          Swal.fire({
            text: this.translateService.instant('El archivo que intentas subir es demasiado grande, se permite un peso máximo de 50mb'),
            confirmButtonColor: '#000',
            icon: 'warning'
          }).then(() => {
            (<HTMLInputElement>document.getElementById("input_file")).value = "";
            this.text_input_file = "+ " + this.translateService.instant('Subir archivo')
            this.icon_input_file = "";
            this.show_icon_docs = false;
            this.formFiles.get('type_resource').enable();
          })
        } else {
          this.show_icon_docs = true;
          var document = event.target.files[0];
          
          this.currentImg = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.target.files[0]));
          let a = tipoFIle.toString().split('/')

          if (a[0] == 'image') {
            this.imageFile = document;
            // this.currentImg = document;
            this.formFiles.get('img')?.setValue('value load')
          } else {
            this.documento = document;
            this.formFiles.get('file').setValue('value load')
          }
          this.load_file = true;

          this.text_input_file = event.target.files[0].name;
          reader.readAsDataURL(event.target.files[0]);
        }

      }

    }


  }


  detectFileVideo(event){
    this.videoFile = event.target.files[0];

  }

  /**
   * Toma la duración del archivo de audio y la convierte en una cadena con el formato hh:mm:ss.
   * @param load_event - Evento
   */
  setDuration(load_event): void {
    this.duration = Math.round(load_event.currentTarget.duration);
    let hour: any = Math.floor(this.duration / 3600);
    hour = (hour < 10) ? '0' + hour : hour;
    var minute: any = Math.floor((this.duration / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    var second: any = this.duration % 60;
    second = (second < 10) ? '0' + second : second;
    this.duracion_completa_audio = hour + ':' + minute + ':' + second;
    // console.log(hour + ':' + minute + ':' + second)
  }

  /**
   * Este metodo verificara que coincidan el tipo de archivo seleccionado con el tipo de archivo que se intenta subir
   */
  verifyFile(tipoFIle) {
    let result = false;
    let nameArray = tipoFIle.split(".");
    let extension = nameArray[nameArray.length - 1];
    // console.log("Name array: ", nameArray)
    if (this.type_file != '5' && this.type_file != 'video' && this.type_file != '6') {
      if (extension == 'docx' || extension == 'doc') {
        //Validamos si es word:
        if (this.formFiles.get('type_resource').value != '2') {
          Swal.fire({
            text: this.translateService.instant('El tipo de archivo que intentas subir no coincide con el tipo de archivo seleccionado'),
            confirmButtonColor: '#000',
            icon: 'info'
          })
          result = false;
        } else {
          result = true;
          this.icon_input_file = "fa-solid fa-file-word";
        }
      } else if (extension == 'xls' || extension == 'xlsx') {
        //Validamos si es excel:
        if (this.formFiles.get('type_resource').value != '3') {
          Swal.fire({
            text: this.translateService.instant('El tipo de archivo que intentas subir no coincide con el tipo de archivo seleccionado'),
            confirmButtonColor: '#000',
            icon: 'info'
          })
          result = false;
        } else {
          result = true;
          // console.log("Es un excel")
          this.icon_input_file = "fa-solid fa-file-excel";
        }
      } else if (extension == 'pdf') {
        //Validamos si es pdf:
        if (this.formFiles.get('type_resource').value != '1') {
          Swal.fire({
            text: this.translateService.instant('El tipo de archivo que intentas subir no coincide con el tipo de archivo seleccionado'),
            confirmButtonColor: '#000',
            icon: 'info'
          })
          result = false;
        } else {
          result = true;
          this.icon_input_file = "fa-solid fa-file-pdf";
        }
      } else if (extension == 'pptx' || extension == 'ppt') {
        //Validamos si es powert point:
        if (this.formFiles.get('type_resource').value != '4') {
          Swal.fire({
            text: this.translateService.instant('El tipo de archivo que intentas subir no coincide con el tipo de archivo seleccionado'),
            confirmButtonColor: '#000',
            icon: 'info'
          })
          result = false;
        } else {
          result = true;
          // console.log("Es un poertpoint")
          this.icon_input_file = "fa-solid fa-file-powerpoint";
        }
      } else {
        Swal.fire({
          text: this.translateService.instant('Parece que el tipo de archivo que intentas subir no es un documento, asegúrate que el archivo tenga una extensión conocida'),
          confirmButtonColor: '#000',
          icon: 'info'
        })
        result = false;
      }
    } else {
      if (this.type_file.toString().trim() != '6') {
        if(extension == 'png' || extension == 'jpeg' || extension == 'jpg'){
          // console.log("tipo de archivo es: ", this.type_file)
          result = true;
        }
      } else if (this.type_file == '6') {
        if (extension == 'mp3' ||
          extension == 'mpeg' ||
          extension == 'mp4' ||
          extension == 'opus' ||
          extension == 'flac' ||
          extension == 'webm' ||
          extension == 'wav' ||
          extension == 'ogg' ||
          extension == 'm4a' ||
          extension == 'oga' ||
          extension == 'mid' ||
          extension == 'amr' ||
          extension == 'aiff' ||
          extension == 'wma' ||
          extension == 'au' ||
          extension == 'acc') {
          this.icon_input_file = "fa-solid fa-music";
          result = true;
        } else {
          Swal.fire({
            text: this.translateService.instant('Extensión no conocida, asegúrate de que sea un archivo de audio con un tipo conocido'),
            confirmButtonColor: '#000',
            icon: 'warning'
          })
          result = false;
        }
      }
      else {
        Swal.fire({
          text: this.translateService.instant('La imagen debe estar en formato png, jpg o jpeg.'),
          confirmButtonColor: '#000',
          icon: 'warning'
        })
        result = false;
      }
    }



    return result;
  }


  /**
   * Establece el icono del archivo en el formulario
   * @param tipoFIle tipo de archivo
   */
  setIconFile(tipoFIle) {
    this.show_icon_docs = true;
    // console.log("tipoFIle ", tipoFIle)
    switch (tipoFIle) {
      case 'DOC':
        this.icon_input_file = "fa-solid fa-file-word";
        break;
      case 'XLSX':
        this.icon_input_file = "fa-solid fa-file-excel";
        break;
      case 'PPT':
        this.icon_input_file = "fa-solid fa-file-powerpoint";
        break;
      case 'PDF':
        this.icon_input_file = "fa-solid fa-file-pdf";
        break;
      case 'audio':
        this.icon_input_file = "fa-solid fa-music";
        break;
      default:
        this.icon_input_file = "fa-solid fa-file-circle-plus";
        break;
    }
  }
  /** 
   * Procesa el archivo que se esta creando. para poder ser guardado
  */
  loadDocs() {
    if (this.formFiles.valid) {
      this.formInProcess(true);
      let data
      if (this.type_file != '5' && this.type_file != '6' && this.type_file != 'video') { // no es un documento
        data = {
          "title": this.formFiles.get('title').value,
          "language": this.formFiles.get('language').value,
          "type_resource": this.formFiles.get('type_resource').value,
          "description": this.formFiles.get('description').value,
          "img": null,
          "resource": this.documento
        }
      } else {
        if (this.type_file == '5') { // es un curso
          data = {
            "title": this.formFiles.get('title').value,
            "language": this.formFiles.get('language').value,
            "type_resource": this.formFiles.get('type_resource').value,
            "img": this.imageFile,
            "resource": null,
            "description": this.formFiles.get('description').value
          }
        } else if (this.type_file == '6') { // es un audio
          data = {
            "title": this.formFiles.get('title').value,
            "language": this.formFiles.get('language').value,
            "author": this.formFiles.get('author').value,
            "time_audio": this.duracion_completa_audio,
            "description": this.formFiles.get('description').value,
            "type_resource": 6,
            "img": null,
            "resource": this.documento
          }
        }

      }

      if (this.type_file == 'video') { // es un video, aqui procesamos la url ingresada
        //Validamos que el video tenga una ruta de youtube valida
        data = {
          "id": this.id_course,
          "title": this.formFiles.get('title').value,
          "description": this.formFiles.get('description').value,
          "img": this.imageFile,
          "video": this.videoFile
        }

        // { "title": "bucket_test2", "url": "link", "description": null, "id": 17, "img": "base64" }

        let video = this.formFiles.get('file').value;
        this.saveVideo(data);
      } else {
        this.saveData(data);
      }

      // console.log("Data a enviar: ", data)
    } else {
      Swal.fire({
        icon: 'warning',
        title: this.translateService.instant('Por favor llena todos los datos'),
        confirmButtonColor: '#000'
      }).then(() => {
        this.formFiles.markAllAsTouched();
      })
    }
  }

  /**
 * llama al metodo para guardar el archivo
 * @param data Data a guardar
 */
  saveVideo(data) {
    this.academyService.saveVideo(data).subscribe(
      data => {
        this.formInProcess(false);
        Swal.fire({
          text: this.translateService.instant('Video guardado correctamente'),
          icon: 'success',
          confirmButtonColor: '#000'
        }).then(() => {
          //Cerrar modal
          // si es true recargara la pagina
          this.id_file = 0;
          this.id_course = null;
          this.closeModal.emit(this.type_file);
        })
      },
      error => {
        this.formInProcess(false);
        // console.log(error)
        if (error.type == 413) {
          Swal.fire({
            icon: 'error',
            text: this.translateService.instant('El archivo que intentas subir es demasiado grande'),
            confirmButtonColor: '#000'
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde'),
            confirmButtonColor: '#000'
          })
        }

      }
    )
  }


  /**
   * llama al metodo para guardar el archivo
   * @param data Data a guardar
   */
  saveData(data) {
    // console.log("Data en saveData ts: ", data)
    this.academyService.saveResource(data).subscribe(
      data => {
        this.formInProcess(false);
        Swal.fire({
          text: this.translateService.instant('Archivo guardado correctamente'),
          icon: 'success',
          confirmButtonColor: '#000'
        }).then(() => {
          //Cerrar modal
          // si es true recargara la pagina
          this.id_file = 0;
          this.closeModal.emit(this.type_file);
        })
      },
      error => {
        this.formInProcess(false);
        // console.log(error)
        if (error.type == 413) {
          Swal.fire({
            icon: 'error',
            text: this.translateService.instant('El archivo que intentas subir es demasiado grande'),
            confirmButtonColor: '#000'
          })
        } else {
          Swal.fire({
            icon: 'error',
            text: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde'),
            confirmButtonColor: '#000'
          })
        }

      }
    )
  }
  /**
   * Se ejecuta al salir de la vista
   */
  ngOnDestroy() {
    this.id_file = 0;
  }
  /**
   * Procesa los datos para poder editar el archivo en cuestion
   */
  editFile() {
    if (this.formFiles.valid) {
      this.formInProcess(true);
      let data
      if (this.type_file != '5' && this.type_file != '6' && this.type_file != 'video') {
        let document;
        if (this.documento == undefined) {
          document = null;
        } else {
          document = this.documento;
        }
        data = {
          "id": this.id_file,
          "title": this.formFiles.get('title').value,
          "language": this.formFiles.get('language').value,
          "description": this.formFiles.get('description').value,
          "type_document": this.formFiles.get('type_resource').value,
          "img": null,
          "document": document
        }
      } else {
        if (this.type_file == '5') {
          data = {
            "id": this.id_file,
            "title": this.formFiles.get('title').value,
            "language": this.formFiles.get('language').value,
            "type_document": this.formFiles.get('type_resource').value,
            "img": this.imageFile,
            "document": null,
            "description": this.formFiles.get('description').value
          }
        } else if (this.type_file == '6') {
          data = {
            "id": this.id_file,
            "title": this.formFiles.get('title').value,
            "language": this.formFiles.get('language').value,
            "author": this.formFiles.get('author').value,
            "time_audio": this.duracion_completa_audio,
            "description": this.formFiles.get('description').value,
            "type_document": this.formFiles.get('type_resource').value,
            "img": null,
            "document": this.documento
          }

          // console.log("Data a editar : ", data)
        }

      }
      if (this.type_file == 'video') {
        data = {
          "id": this.id_current_video,
          "title": this.formFiles.get('title').value,
          "description": this.formFiles.get('description').value,
          "img": this.imageFile,
          "video": this.videoFile
        }
        this.editVideo(data)
      } else {
        this.editData(data)
      }


      // console.log("Data a enviar: ", data)
    } else {
      Swal.fire({
        icon: 'warning',
        title: this.translateService.instant('Por favor llena todos los datos'),
        confirmButtonColor: '#000'
      }).then(() => {
        this.formFiles.markAllAsTouched();
      })
    }
  }

  /**
   * Edita un video
   * @param data Información a editar del video
   */
  editVideo(data) {
    this.academyService.editVideo(data).subscribe(
      data => {
        this.formInProcess(false);
        Swal.fire({
          text: this.translateService.instant('Video editado correctamente'),
          icon: 'success',
          confirmButtonColor: '#000'
        }).then(() => {
          //Cerrar modal
          // si es true recargara la pagina
          this.id_file = 0;
          this.id_course = null;
          this.closeModal.emit(this.type_file);
        })
      },
      error => {
        this.formInProcess(false);
        if (error.type == 413) {
          Swal.fire({
            icon: 'error',
            text: this.translateService.instant('El archivo que intentas subir es demasiado grande'),
            confirmButtonColor: '#000'
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde'),
            confirmButtonColor: '#000'
          })
        }

      }
    )
  }




  /**
   * llama al metodo para editar el archivo
   * @param data datos del archivo
   */
  editData(data) {
    this.academyService.editResource(data).subscribe(
      data => {
        this.formInProcess(false);
        Swal.fire({
          text: this.translateService.instant('Archivo editado correctamente'),
          icon: 'success',
          confirmButtonColor: '#000'
        }).then(() => {
          //Cerrar modal
          // si es true recargara la pagina
          this.id_file = 0;
          this.closeModal.emit(this.type_file);
        })
      },
      error => {
        this.formInProcess(false);
        if (error.type == 413) {
          Swal.fire({
            icon: 'error',
            text: this.translateService.instant('El archivo que intentas subir es demasiado grande'),
            confirmButtonColor: '#000'
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde'),
            confirmButtonColor: '#000'
          })
        }

      }
    )
  }

  /**
   * Este metodo bloquea el boton de crear o editar si esta en curso uno de estos mismo procesos.
   * @param value en curso: true,  no esta en curso: false
   */
  formInProcess(value: boolean) {
    if (value) {
      this.loading_spinner = true;
      document.getElementById('btn-form-files').setAttribute('disabled', 'disabled');
    } else {
      this.loading_spinner = false;
      document.getElementById('btn-form-files').removeAttribute('disabled');
    }
  }

}
