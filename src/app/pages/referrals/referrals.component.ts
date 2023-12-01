import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ReferralsService } from 'src/app/services/referrals.service';
@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent {
  main_ref;
  list_referrals
  refOfref = [];
  listIdsRef = [];
  remainingList = [];

  zoomFactor = 1;
  minZoom = 0.5;
  maxZoom = 1;
  zoomStep = 0.1;
  typeUser;
  ids_divs = [];
  totalUsers;
  constructor(private elementRef: ElementRef,
    private renderer: Renderer2,
    private referrlasService: ReferralsService) {
    this.typeUser = localStorage.getItem('type_user');
    this.getReferrals();
    
    if(this.typeUser == '1')
      this.getAmountUsers();

    this.main_ref = localStorage.getItem('username');
  }

  zoomIn() {
    this.zoomFactor += this.zoomStep;
    this.applyZoom();
  }

  zoomOut() {
    this.zoomFactor -= this.zoomStep;
    this.applyZoom();
  }

  private applyZoom() {
    this.zoomFactor = Math.min(Math.max(this.zoomFactor, this.minZoom), this.maxZoom);
    this.renderer.setStyle(this.elementRef.nativeElement.querySelector('.first-ul'), 'transform', `scale(${this.zoomFactor})`);
  }


  getAmountUsers(){
    this.referrlasService.amountUsers().subscribe(
      data =>{
        this.totalUsers = data.data;
      },
      error => {
      
      })
  }


  /**
   * Obtiene los referidos y los agrega a la estructura del árbol.
   * @param id ID opcional del referido padre.
   */
  getReferrals(id?: any) {
    let id_: any = 0;
    let id_father_: any = 1;

    if (id !== undefined) {
      id_ = id;
      id_father_ = id;
    }

    this.referrlasService.getReferred(id_).subscribe(
      data => {
        let result: any = data;
        // this.totalUsers = result.
        // this.main_ref = result.data.user;
        this.list_referrals = result.data.resp;
        this.refOfref[0] = result.data.resp;
        if(this.typeUser != '1'){     
          const maxBranches = 5;
          let addedBranches = 0;
          this.list_referrals.forEach(element => {
            if (addedBranches >= maxBranches) {
              this.remainingList.push(element);
              // console.log("Lista restante: ", this.remainingList)
              return; // Se alcanzó el límite de ramas, se sale del bucle forEach.
            }
  
            if (this.listIdsRef.includes(element.referral__id)) {
              // Si el ID del referido ya está en la lista, no se agrega nuevamente.
            } else {
              this.addBranchToTree(id_father_, element.referral__username, element.referral__id);
              this.listIdsRef.push(element.referral__id);
              addedBranches++;
            }
          });
          if (addedBranches >= maxBranches) {
            // console.log("Entro acá en referidos")
            this.addBranchToTree(id_father_, "Ver más", "vermas");
          }

        }else{
          
        }
      },
      error => {
        // Manejo de errores en la solicitud del servicio.
      }
    );
    
  }
  
/**
  Eliminar el elemento para ver más y agrega las ramas faltantes al arbol
 */
  addRemaining(){
    document.getElementById('li_vermas').classList.add('d-none');
    this.remainingList.forEach(element => {
      this.addBranchToTree(1, element.referral__username, element.referral__id);
    })
  }


  /**
   * Agregar un nuevo li dentro de un ul
   * @param id id del padre de los hermano, es decir del ul que contiene las listas
   */
  addBranchToTree(id?: any, username?: any, id_child?: any) {
    const id_father = id ?? '1'; // Utilizar operador de fusión nula (nullish coalescing operator) para establecer el ID del padre

    const ulElement = this.elementRef.nativeElement.querySelector(`#ul_inside_of_li_${id_father}`);

    const newli = this.renderer.createElement('li');
    const newul = this.renderer.createElement('ul');
    const newa = this.renderer.createElement('a');
    const insideNewa = this.renderer.createText(username);

    this.renderer.addClass(newul, 'animate__animated'); // Clase necesaria para las animaciones
    this.renderer.setAttribute(newli, 'id', `li_${id_child}`); // Ids necesarios para interactuar con el elemento
    this.renderer.setAttribute(newul, 'id', `ul_inside_of_li_${id_child}`); // Ids necesarios para interactuar con el elemento
    this.renderer.addClass(newul, 'no-data-content'); // Se establece esta clase para despues saber si la información que contiene este elemento ya fue consultada, de esta manera evito llamar al metodo cada vez que se haga clic
    this.renderer.setStyle(newul, 'display', 'none'); //Por defecto se ocultara el ul para evitar que se muestre una linea debajo la cual no llevaria a ningun lado
    this.renderer.addClass(newa, 'contracted'); //Por defecto se asume que esta contraido el contenido, aun que de momento no haya ningun contenido, esto es para las animaciones
    this.renderer.appendChild(newa, insideNewa);

    this.renderer.listen(newa, 'click', () => {
      if (id_child != 'vermas') {
        const isExpanded = newa.classList.contains('expanded');
        const isContracted = newa.classList.contains('contracted');

        if (isExpanded) {
          if (newul.classList.contains('animate__fadeInDown')) {
            this.renderer.removeClass(newul, 'animate__fadeInDown');
          }
          this.renderer.removeClass(newa, 'expanded');
          this.renderer.addClass(newa, 'contracted');
          this.renderer.addClass(newul, 'animate__fadeOutUp');
          setTimeout(() => {
            this.renderer.setStyle(newul, 'display', 'none');
          }, 400);
        } else if (isContracted) {
          if (newul.classList.contains('no-data-content')) {
            this.getReferrals(id_child);
          }
          this.renderer.removeClass(newul, 'no-data-content');
          this.renderer.removeClass(newa, 'contracted');
          this.renderer.removeClass(newul, 'animate__fadeOutUp');
          this.renderer.setStyle(newul, 'display', 'block');
          this.renderer.addClass(newul, 'animate__fadeInDown');
          this.renderer.addClass(newa, 'expanded');
        }
      } else {
        // console.log("Quieres ver más")
        this.addRemaining();
      }

    });

    this.renderer.appendChild(ulElement, newli);
    this.renderer.appendChild(newli, newa);
    this.renderer.appendChild(newli, newul);
  }

  getReferralsAdmin(id, index) {
    // console.log("El id es: ", '#dinamic_' + id)

    this.referrlasService.getReferred(id).subscribe(
      data => {
        let result: any = data;
        this.refOfref = result.data.resp;
        // console.log("this.refOfref: ", this.refOfref)
        const divElement = this.elementRef.nativeElement.querySelector('#dinamic_' + id);
  
        if (this.ids_divs.includes(id)) {
          // console.log("Incluye el id. no se debe volver a hacer el html")
        } else {
          // console.log("No incluye el id. se debe hacer el html");
  
          this.refOfref.forEach((element, index) => {
            // console.log("Element: ", element)
            const accordionItem = this.renderer.createElement('div');
            this.renderer.addClass(accordionItem, 'accordion-item');
  
            const accordionHeader = this.renderer.createElement('div');
            this.renderer.addClass(accordionHeader, 'accordion-header');
  
            const accordionButton = this.renderer.createElement('button');
            this.renderer.addClass(accordionButton, 'accordion-button');
            this.renderer.addClass(accordionButton, 'collapsed');
            if(element.status == false){
              // console.log("El estado de este es: ", element.status )
              this.renderer.addClass(accordionButton, 'inactive');
            }
            this.renderer.setAttribute(accordionButton, 'type', 'button');
            this.renderer.setAttribute(accordionButton, 'data-bs-toggle', 'collapse');
            this.renderer.setAttribute(accordionButton, 'data-bs-target', '#referralsOfRef_' + element.referral__id);
            this.renderer.setAttribute(accordionButton, 'aria-expanded', 'false');
            this.renderer.setAttribute(accordionButton, 'aria-controls', 'referralsOfRef_' + element.referral__id);
  
            this.renderer.listen(accordionButton, 'click', () => {
              this.getReferralsAdmin(element.referral__id, index);
            });
  
            const accordionCollapse = this.renderer.createElement('div');
            this.renderer.setAttribute(accordionCollapse, 'id', 'referralsOfRef_' + element.referral__id);
            this.renderer.addClass(accordionCollapse, 'accordion-collapse');
            this.renderer.addClass(accordionCollapse, 'collapsed');
  
            const accordionBody = this.renderer.createElement('div');
            // const contenidoBody = this.renderer.createText('Contenido de ' + element.referral__username);
  
            const contenidoDinamic = this.renderer.createElement('div');
            this.renderer.setAttribute(contenidoDinamic, 'id', 'dinamic_' + element.referral__id); // Use element.referral__id instead of id
  
            const contenidoButton = this.renderer.createText('' + element.referral__username);
  
            this.renderer.appendChild(accordionButton, contenidoButton);
            this.renderer.appendChild(accordionCollapse, contenidoDinamic); // Attach contenidoDinamic to accordionCollapse
            // this.renderer.appendChild(accordionBody, contenidoBody);
            this.renderer.appendChild(accordionHeader, accordionButton);
            this.renderer.appendChild(accordionItem, accordionHeader);
            this.renderer.appendChild(accordionItem, accordionCollapse); // Attach accordionCollapse to accordionItem
            this.renderer.appendChild(accordionItem, accordionBody);
            this.renderer.appendChild(divElement, accordionItem);
          });
  
          this.ids_divs.push(id);
        }
      },
      error => {
        // Handle error
      }
    );
  }

}
