import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { WalletService } from 'src/app/services/wallet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  username;
  email;
  closeResult;
  formChangePassword: FormGroup;
  showPassword;
  loading = false;
  currentRol;
  walletTyping = "";
  walletSuper;
  codeForWallet = "";
  walletMarketing;
  walletSp;
  titleModalWallet = 'Agrega una wallet de pago';

  constructor(private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private walletService: WalletService,
    private translateService: TranslateService) {
    this.formChangePassword = this.formBuilder.group({
      code: ['', [Validators.required]],
      newPass: ['', [Validators.required]],
      verifyPass: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    this.currentRol = localStorage.getItem('type_user');
    this.username = localStorage.getItem('username');
    this.email = localStorage.getItem('email');
    this.walletMarketing = localStorage.getItem('wallet')
    this.walletSp = localStorage.getItem('wallet_sp')
  }



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
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  saveWalletSuper() {
    this.walletService.saveWalletSuper(this.walletSuper).subscribe({
      next: (data: any) => {
        Swal.fire({
          icon: 'success',
          text: this.translateService.instant('Wallet guardada')
        }).then(() => {
          document.getElementById('closeModal')?.click();
        })
      },

      error: (error) => {
        if (error.error.error == 'this address not valid') {
          Swal.fire({
            icon: 'error',
            text: this.translateService.instant('La wallet que intentas guardar no es valida')
          })
        } else {
          Swal.fire({
            icon: 'error',
            text: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde')
          })
        }
      }
    })
  }

  clickId(id) {
    document.getElementById(id)?.click();
  }

  verifiPassword() {
    let password = this.formChangePassword.get('newPass').value;
    let password_verify = this.formChangePassword.get('verifyPass').value;
    if (password === password_verify) {
      return true;
    } else {
      Swal.fire({
        title: this.translateService.instant('Error'),
        icon: 'warning',
        text: this.translateService.instant('Las contraseñas ingresadas no coinciden')
      })
      return false;
    }
  }

  saveWalletForPay(typeWallet?) {
    if (this.walletTyping != "" && this.codeForWallet != "") {
      this.loading = true;
      let nameMethod = 'PostWallet';
      if (typeWallet == 'walletSuper')
        nameMethod = 'SpWallet';

      this.walletService.sendWalletForPayments(this.walletTyping, this.codeForWallet, nameMethod).subscribe(
        data => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            text: this.translateService.instant('Tu wallet se ha guardado')
          }).then(() => {
            document.getElementById('closeModal')?.click();
            localStorage.setItem('wallet', this.walletTyping);
            if (nameMethod == 'SpWallet') {
              localStorage.setItem('wallet_sp', this.walletTyping);
              setTimeout(() => {
                this.walletSp = localStorage.getItem('wallet_sp')
                // console.log("Wallet de pago: ", this.walletSp)
              }, 100);
            } else {
              this.walletMarketing = this.walletTyping;
            }
          })
        },
        error => {
          this.loading = false;
          if (error.error.error == 'this address not valid') {
            Swal.fire({
              icon: 'error',
              text: this.translateService.instant('La wallet que intentas guardar no es valida')
            })
          } else if (error.error.error == 'código incorrecto') {
            Swal.fire({
              icon: 'error',
              text: this.translateService.instant('El código que ingresaste es incorrecto')
            }).then(() => {
              // document.getElementById('closeModal').click();
            })
          } else if (error.error.error == 'This address already in other account') { //
            Swal.fire({
              icon: 'error',
              text: this.translateService.instant('Esta wallet ya se encuentra registrada en otra cuenta')
            }).then(() => {
              // document.getElementById('closeModal').click();
            })
          } else if (error.error.error == 'Este código ya expiro o fue usado, solicita otro.') {
            Swal.fire({
              title: this.translateService.instant('Error'),
              icon: 'error',
              text: this.translateService.instant('El código ya venció, debes solicitar uno nuevo')
            }).then(() => {
              this.codeForWallet = "";
            })
          }
          else {
            Swal.fire({
              icon: 'error',
              text: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde')
            })
          }
        })
    } else {
      Swal.fire({
        icon: 'warning',
        text: this.translateService.instant('Asegurate de llenar todos los datos')
      })
    }
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

  prepareGetCode(nameMethod?) {
    if (nameMethod == 'walletSuper') {
      this.getCode(nameMethod);
    } else {
      let wallet = localStorage.getItem('wallet');
      if (wallet != undefined && wallet != null && wallet != "") {
        this.getCode(nameMethod);
      } else {
        document.getElementById('openModalAddWallet').click();
      }
    }
  }

  getCode(nameMethod?) {
    let textShow = "Para cambiar tu contraseña se enviará un código de confirmación a tu correo";
    if (nameMethod == 'wallet') {
      textShow = "Para cambiar tu wallet de pago te enviaremos un código de verificación a tu correo"
    } else if (nameMethod == 'walletSuper') {
      if (this.walletSp != undefined) {
        textShow = "Para cambiar la wallet master te enviaremos un código de verificación a tu correo"
      } else {
        textShow = "Para guardar la wallet master te enviaremos un código de verificación a tu correo"
      }
    }

    Swal.fire({
      icon: 'info',
      text: this.translateService.instant(textShow),
      confirmButtonText: this.translateService.instant('Aceptar'),
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('Cancelar')
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.authenticationService.getCodeAfterLogging().subscribe(
          data => {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              text: this.translateService.instant('Se ha enviado un código de verificación al correo') + " :" + this.email
            }).then((result) => {
              if (nameMethod != undefined) {

                // console.log("nameMethod: ", nameMethod)
                if (nameMethod == 'walletSuper') {
                  this.titleModalWallet = 'Wallet Master';
                }

                document.getElementById('openModalAddWalletInProfile').click();
              } else {
                document.getElementById('openModalChangePassword').click();
              }
            })
          },
          error => {
            this.loading = false;
            Swal.fire({
              title: this.translateService.instant('Error'),
              icon: 'error',
              text: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde')
            })
          })
      }
    })
  }

  changePassword() {
    if (this.formChangePassword.valid) {
      if (this.verifiPassword()) {
        this.loading = true;
        let data = {
          code: this.formChangePassword.get('code').value,
          password: this.formChangePassword.get('newPass').value
        }

        this.authenticationService.changePasswordAfterLogging(data).subscribe(
          data => {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              text: this.translateService.instant('Contraseña actualizada')
            }).then(() => {
              document.getElementById('closeModal').click();
              this.formChangePassword.reset();
            })
          },
          error => {
            this.loading = false;
            let messageError = error.error.error;
            if (messageError == 'Este código ya expiro o fue usado, solicita otro.') {
              Swal.fire({
                title: this.translateService.instant('Error'),
                icon: 'error',
                text: this.translateService.instant('El código ya venció, debes solicitar uno nuevo')
              })
            } else if (messageError == 'código incorrecto') {
              Swal.fire({
                title: this.translateService.instant('Error'),
                icon: 'error',
                text: this.translateService.instant('Código incorrecto')
              })

            } else if (messageError == 'Este correo no se encuentra registrado') {
              Swal.fire({
                title: this.translateService.instant('Error'),
                icon: 'error',
                text: this.translateService.instant('Este correo no se encuentra registrado')
              })
            } else {
              Swal.fire({
                title: this.translateService.instant('Error'),
                icon: 'error',
                text: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde')
              })
            }
          })
      }
    } else {
      this.formChangePassword.markAllAsTouched();
    }
  }


  /**
* Si el usuario presiona la tecla ESC, regrese 'presionando ESC'.Si el usuario hace clic en el telón de fondo,
* Regrese 'haciendo clic en un telón de fondo'.De lo contrario, regrese 'con:' + razón.
* @param {cualquier razón}, cualquiera, la razón por la que se descarta el modal.
* @returns La razón por la que se está cerrando el modal.
*/
  private getDismissReason(reason: any): string {
    this.walletSuper = "";
    this.walletTyping = "";
    this.codeForWallet = "";
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}
