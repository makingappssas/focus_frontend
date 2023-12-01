import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReCaptcha2Component } from 'ngx-captcha';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form_show = "login";
  formLogin: FormGroup;
  token;
  language;
  env = environment;
  showCapchatRegister = false;
  hiddenLinkLogin = false;
  loading = false;
  emailForForgetPass = '';
  isValidEmail: boolean;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  showPassword: boolean;
  routeImgLanguage;

  // PARA CUANDO SE HAYA OLVIDADO LA CONTRASEÑA
  codeForChangePass;
  newPass;
  verifyPass;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private _route: ActivatedRoute,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService) {
    this.formLogin = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    this.language = localStorage.getItem('CurrentLang');
    if (this.language == 'es') {
      this.routeImgLanguage = './assets/logos/spain.webp';
    } else if (this.language == 'en') {
      this.routeImgLanguage = './assets/logos/usa.webp';
    }

    if (this._route.snapshot.paramMap.get('referrals') != undefined) {
      this.chengeCurrentForm('register');
    }

  }


  setLanguauge(language) {
    this.translateService.use(language);
    if (language == 'es') {
      this.routeImgLanguage = './assets/logos/spain.webp';
    } else if (language == 'en') {
      this.routeImgLanguage = './assets/logos/usa.webp';
    }
    this.language = language;
    localStorage.setItem('CurrentLang', language);
    // setTimeout(() => {
    //   this.reloadCapchat();
    // }, 100);
  }

  /**
  * Establece el token en indefinido, establece la carga en falso y vuelve a cargar el captcha.
  */
  reloadCapchat() {
    this.token = undefined;
    this.loading = false;
    this.captchaElem.reloadCaptcha();
  }

  validateEmail(email: string): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isValidEmail = emailRegex.test(email);
  }


  handleSuccess(event) {
    this.token = event;
    // console.log("Token capchat: ", this.token)
  }

  chengeCurrentForm(form) {
    this.form_show = form;
    this.emailForForgetPass = "";
    if (form == 'register') {
      this.showCapchatRegister = true;
    } else {
      this.showCapchatRegister = false;
    }
  }

  hiddenLink(event) {
    if (event) {
      this.hiddenLinkLogin = true;
    } else {
      this.hiddenLinkLogin = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  sendEmailForget() {
    if (this.emailForForgetPass != '') {
      if (this.isValidEmail == true) {
        this.loading = true;
        this.authenticationService.forgetPassword(this.emailForForgetPass, this.token).subscribe(
          data => {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              text: this.translateService.instant('Se ha enviado un correo a: ') + this.emailForForgetPass
            }).then(() => {
              this.form_show = 'change-password';
            })
          },
          error => {
            this.loading = false;
            this.reloadCapchat();
            let messageError = error.error.error;
            if (messageError == 'Este correo no se encuentra registrado') {
              Swal.fire({
                title: this.translateService.instant('Error'),
                icon: 'error',
                text: this.translateService.instant('Este correo no se encuentra registrado')
              })
            }
            else {
              Swal.fire({
                title: this.translateService.instant('Error'),
                icon: 'error',
                text: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde')
              })
            }

          })
      } else {
        Swal.fire({
          icon: 'warning',
          text: this.translateService.instant('Asegurate de ingresar un email valido')
        })
      }

    } else {
      Swal.fire({
        title: this.translateService.instant('Error'),
        icon: 'warning',
        text: this.translateService.instant('Debes digitar un correo')
      })
    }

  }

  /**
   * Metodo para cambiar contraseña por olvido.
   */
  changePassord() {
    if (this.codeForChangePass != undefined &&
      this.newPass != undefined &&
      this.verifyPass != undefined) {
      if (this.token != undefined) {
        if (this.newPass == this.verifyPass) {
          this.loading = true;
          let data = {
            code: this.codeForChangePass,
            password: this.newPass,
            token: this.token,
            email: this.emailForForgetPass
          }
          this.authenticationService.changePasswordForForgotten(data).subscribe(
            data => {
              this.loading = false;
              Swal.fire({
                icon: 'success',
                text: this.translateService.instant('Contraseña actualizada')
              }).then(() => {
                this.showLogin();
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
        } else {
          Swal.fire({
            title: this.translateService.instant('Error'),
            icon: 'warning',
            text: this.translateService.instant('Las contraseñas ingresadas no coinciden')
          })
          this.reloadCapchat();
        }
      } else {
        Swal.fire({
          icon: 'warning',
          text: this.translateService.instant('Parece que aun no has llenado el capchat')
        })
      }

    } else {
      Swal.fire({
        title: this.translateService.instant('Error'),
        icon: 'warning',
        text: this.translateService.instant('Asegurate de llenar todos los datos')
      })
    }
  }

  showLogin() {
    this.form_show = "login";
  }

  login() {
    if (this.token == undefined) {
      Swal.fire({
        icon: 'warning',
        text: this.translateService.instant('Parece que aun no has llenado el capchat')
      })
    } else {
      if (this.formLogin.valid) {
        this.loading = true;
        let user = this.formLogin.get('username').value;
        let password = this.formLogin.get('password').value;
        this.authenticationService.loginUser(user, password, this.token).subscribe(
          data => {
            // console.log(data)
            let data_user = data.data;
            localStorage.setItem('token', data_user.token);
            localStorage.setItem('email', data_user.email);
            localStorage.setItem('username', data_user.username);
            localStorage.setItem('type_user', data_user.type_user);
            localStorage.setItem('CurrentLang', data_user.language);
            localStorage.setItem('link_referrals', data_user.code_referral);
            if (data_user.wallet)
              localStorage.setItem('wallet', data_user.wallet);
            
            if (data_user.wallet_sp)
              localStorage.setItem('wallet_sp', data_user.wallet_sp);

            if (data_user.type_user == 3) {
              this.router.navigate(['/buytoken'])
            } else if (data_user.type_user == 2) {
              this.router.navigate(['/history'])
            }
            else {
              this.router.navigate(['/profile'])
            }
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.reloadCapchat();
            if (error.error.error == "Este correo no se encuentra registrado" ||
              error.error.error == "Este usuario no se encuentra registrado" ||
              error.error.error == "Contraseña incorrecta") {
              Swal.fire({
                title: this.translateService.instant('Error'),
                icon: 'error',
                text: this.translateService.instant('Usuario o contraseña incorrecto')
              })
            } else {
              Swal.fire({
                title: this.translateService.instant('Error'),
                icon: 'error',
                text: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde')
              })
            }
            // console.log("Error al intentat Sesión inicada")
          })
      } else {
        this.reloadCapchat();
        Swal.fire({
          icon: 'warning',
          text: this.translateService.instant('Asegurate de llenar todos los datos')
        })
      }
    }

  }
}
