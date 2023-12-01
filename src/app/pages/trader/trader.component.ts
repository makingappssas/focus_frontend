import { Component } from '@angular/core';

@Component({
  selector: 'app-trader',
  templateUrl: './trader.component.html',
  styleUrls: ['./trader.component.scss']
})
export class TraderComponent {
  isChecked = true;
  nameStatus = "En ejecución";
  nameStatusTwo = "Activo";
  toggleCheckbox(): void {
    if(this.isChecked){
      this.nameStatus = "En ejecución"
      this.nameStatusTwo = "Activo"
    }else{
      this.nameStatusTwo = "Inactivo"
      this.nameStatus = "Detenido"
    }
    // Aquí puedes agregar la lógica adicional cuando el checkbox cambie de estado
  }
}
