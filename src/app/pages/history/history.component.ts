import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HistoryService } from 'src/app/services/history.service';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

  users = [];
  currentUserFilter = "";
  status = [
    {
      name: 'Aprovado',
      status: true
    },
    {
      name: 'Cancelado',
      status: false
    }
  ];
  currentStatusFilter = "";
  currentNFTFilter = "";
  currentRol;
  nameMethod = 'HistoryBlr';
  date_start = "";
  date_end = "";

  tokens = [];
  nfts = [];
  earning = [];

  page = 1;
  pageSize = 6;
  items_per_page = 8;
  nameButtonTokens = "Ver mis tokens";
  nameButtonNfts = "Ver mis NFTs";
  nameButtonRef = "Ganancias referidos";
  nameTableReferrals = "Ganancias referidos";
  acumulated_blr;
  acumulated_usdt;
  cant_classic;
  cant_elite;
  cant_royal;

  constructor(private historyService: HistoryService,
    private translateService: TranslateService,
    private utilityService: UtilityService) {

  }

  ngOnInit() {
    this.currentRol = localStorage.getItem('type_user');
    this.getHistory(this.nameMethod)
    localStorage.setItem('currentViewHistory', 'table-tokens')
    if (this.currentRol == '2')
      this.getAllUsers();

    if (this.currentRol != '3') {
      this.nameButtonTokens = "Tokens";
      this.nameButtonNfts = "NFTs";
      this.nameButtonRef = "Transacciones referidos";
      this.nameTableReferrals = "Transacciones referidos"
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('currentViewHistory');
  }

  getAllUsers() {
    this.utilityService.listUsers().subscribe({
      next: (data) => {
        this.users = data.data;
      },
      error: (error) => {

      }
    })
  }


  /**
* Copia una cadena al portapapeles.
* @param argument - 'valor a copiar'
*/
  copy(argument) {

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



  handlerViewTables(tableToShow) {
    const TableTokens = document.querySelector('#table-tokens');
    const TableNFTs = document.querySelector('#table-ntfs');
    const buttons = document.querySelectorAll('.btn-for-show-tables');
    buttons.forEach(element => {
      element.setAttribute('disabled', 'disabled')
    });
    let classForHiddenLeft = 'animate__bounceOutLeft';
    let classForHiddenRight = 'animate__bounceOutRight';
    let classForShowRight = 'animate__bounceInRight';
    let classForShowLeft = 'animate__bounceInLeft';
    if (tableToShow == 'table-ntfs') {
      if (this.nameMethod != 'HistoryNft') {
        localStorage.setItem('currentViewHistory', 'table-ntfs')
        this.getHistory('HistoryNft');
      }
      this.nameMethod = 'HistoryNft';
      TableTokens.classList.add(classForHiddenLeft)
      setTimeout(() => {
        TableTokens.classList.add('d-none')
        if (TableNFTs.classList.contains(classForHiddenRight)) {
          TableNFTs.classList.remove(classForHiddenRight)
          TableNFTs.classList.remove('d-none')
        }
        TableNFTs.classList.add(classForShowRight)
        TableNFTs.classList.remove('d-none')

        buttons.forEach(element => {
          element.removeAttribute('disabled')
        });
      }, 400);
    } else if (tableToShow == 'table-tokens') {
      if (this.nameMethod != 'HistoryBlr') {
        localStorage.setItem('currentViewHistory', 'table-tokens')
        this.getHistory('HistoryBlr');
      }
      this.nameMethod = 'HistoryBlr';
      TableNFTs.classList.add(classForHiddenRight)
      setTimeout(() => {
        TableNFTs.classList.add('d-none')
        if (TableTokens.classList.contains(classForHiddenLeft)) {
          TableTokens.classList.remove(classForHiddenLeft)
          TableTokens.classList.remove('d-none')
        }
        TableTokens.classList.add(classForShowLeft)
        TableTokens.classList.remove('d-none')

        buttons.forEach(element => {
          element.removeAttribute('disabled')
        });
      }, 400);
    } else if (tableToShow == 'table-referrals') {
      localStorage.setItem('currentViewHistory', 'table-ref')
    }
  }

  hiddeTable(table_show) {
    let classForHiddenRight = 'animate__bounceOutRight';
    const CurrentTable = document.querySelector('#' + localStorage.getItem('currentViewHistory'));
    setTimeout(() => {
      CurrentTable.classList.add('d-none')
      this.showTable(table_show);
    });
  }

  showTable(nameTable) {
    let currentView = localStorage.getItem('currentViewHistory');
    if(currentView != nameTable){
      switch (nameTable) {
        case 'table-tokens':
          this.getHistory('HistoryBlr');
          this.nameMethod = "HistoryBlr";
          break;
        case 'table-ntfs':
          this.getHistory('HistoryNft');
          this.nameMethod = "HistoryNft";
          break;
        case 'table-referrals':
          this.getHistory('HistoryReferralsEarnings');
          this.nameMethod = "HistoryReferralsEarnings";
          break;
        default:
          break;
      }
    }
    localStorage.setItem('currentViewHistory', nameTable)
    let classForShowRight = 'animate__bounceInRight';
    let TableView = document.querySelector('#' + nameTable);
    // TableView.classList.add(classForShowRight)
    TableView.classList.remove('d-none')
  }

  getHistory(nameMethod) {
    let status = true;
    if (this.currentStatusFilter == 'false')
      status = false;

    let data = {
      user: this.currentUserFilter,
      status: status,
      date_end: this.date_end,
      date_start: this.date_start,
      type_nft: this.currentNFTFilter
    }

    this.historyService.getHistory(data, nameMethod).subscribe({
      next: (data: any) => {
        if (nameMethod == 'HistoryNft') {
          this.nfts = data.data.history;
          this.acumulated_usdt = data.data.amount_usdt;
          this.cant_classic = data.data.cant_classic;
          this.cant_elite = data.data.cant_elite;
          this.cant_royal = data.data.cant_royal;
        } else if(nameMethod == 'HistoryBlr'){
          this.tokens = data.data.history;
          this.acumulated_usdt = data.data.acumulated_usdt;
          this.acumulated_blr = data.data.acumulated_blr;
        } else if(nameMethod == 'HistoryReferralsEarnings'){
          this.earning = data.data.history;
          this.acumulated_usdt = data.data.amount_usdt;
        }
        // console.log("Data: ", data)
      },
      error: (error) => {

      }
    })
  }
}
