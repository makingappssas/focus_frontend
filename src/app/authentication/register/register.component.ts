import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReCaptcha2Component } from 'ngx-captcha';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class RegisterComponent {
  formRegister: FormGroup;
  env = environment;
  language;
  token;
  showCapchat = false;
  formShow = 'register';
  codeVerify;
  loading = false;
  referrals = null;
  @Input() capchat; boolean;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  @ViewChild('captchaElemTwo') captchaElemTwo: ReCaptcha2Component;
  @Output() hiddenLink = new EventEmitter();
  @Output() showLogin = new EventEmitter();
  showPassword: boolean;
  formattedMinutes: string;
  formattedSeconds: string;
  email_send: any;
  count_click_temp = 0;

  constructor(private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private router: Router,
    private _route: ActivatedRoute,
    private authenticationService: AuthenticationService) {
    this.formRegister = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      verify_pass: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    })
  }

  ngOnInit() {
    this.language = localStorage.getItem('CurrentLang');
    this.showCapchat = this.capchat;
    // console.log(this.capchat)
    if(this._route.snapshot.paramMap.get('referrals') != undefined){
      this.referrals = this._route.snapshot.paramMap.get('referrals');
    }

    // console.log(this._route.snapshot.paramMap.get('referrals'))
  }

  backForm() {
    this.formShow = 'register';
  }

  handleSuccess(event) {
    this.token = event;
  }

  
  startTimer() {
    if(this.formattedMinutes == undefined){
      this.count_click_temp = this.count_click_temp + 1;
      let remainingTime;
  
      if(this.count_click_temp == 1){
        remainingTime = 60;
      }else if(this.count_click_temp == 2){
        remainingTime = 180;
      }else if(this.count_click_temp == 3){
        remainingTime = 600;
      }else if(this.count_click_temp == 4){
        remainingTime = 1800;
      }
    
      const intervalId = setInterval(() => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
    
        this.formattedMinutes = String(minutes).padStart(2, '0');
        this.formattedSeconds = String(seconds).padStart(2, '0');
    
        console.log(`${this.formattedMinutes}:${this.formattedSeconds}`);
    
        remainingTime--;
        
        if (remainingTime < 0) {
          this.formattedMinutes = undefined;
          clearInterval(intervalId);
        }
      }, 1000);
    }
}


/**
 * Reenvia el correo.
 */
getCodeResend(){
  if(this.formattedMinutes == undefined){
    this.loading = true;
    this.authenticationService.changeCode(this.email_send).subscribe({
      next: (data) => {
        this.loading = false;
        this.startTimer();
        Swal.fire({
          icon: 'success',
          text: this.translateService.instant('Se ha enviado un código de verificación al correo') + " :" + this.email_send
        }).then(() => {
        })
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          title: this.translateService.instant('Error'),
          icon: 'error',
          text: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde')
        })
      }
    })
  }
}

  /**
 * Establece el token en indefinido, establece la carga en falso y vuelve a cargar el captcha.
 */
  reloadCapchat() {
    this.token = undefined;
    this.loading = false;
    this.captchaElem?.reloadCaptcha();
    if (this.captchaElemTwo != undefined) {
      this.captchaElemTwo?.reloadCaptcha();
    }
  }


  verifiPassword() {
    let password = this.formRegister.get('password').value;
    let password_verify = this.formRegister.get('verify_pass').value;
    if (password === password_verify) {
      return true;
    } else {
      Swal.fire({
        title: this.translateService.instant('Error'),
        icon: 'warning',
        text: this.translateService.instant('Las contraseñas ingresadas no coinciden')
      })
      this.reloadCapchat();
      return false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getCode() {
    if (this.formRegister.valid) {
      if (this.token == undefined) {
        Swal.fire({
          title: this.translateService.instant('Error'),
          icon: 'warning',
          text: this.translateService.instant('Parece que aun no has llenado el capchat')
        })
      } else {
        if (this.verifiPassword()) {
          this.loading = true;
          let email = this.formRegister.get('email').value;
          this.email_send = email;
          let username = this.formRegister.get('username').value;
          this.authenticationService.getCode(email, this.token, username).subscribe(
            data => {
              this.loading = false;
              Swal.fire({
                icon: 'success',
                text: this.translateService.instant('Se ha enviado un código de verificación al correo') + " :" + email
              }).then(() => {
                this.formShow = 'getCode';
                this.token = undefined;
                this.hiddenLink.emit(true);
              })
            },
            error => {
              this.reloadCapchat();
              let messageError = error.error.error;
              if (messageError == 'Este correo ya se encuentra registrado') {
                Swal.fire({
                  title: this.translateService.instant('Error'),
                  icon: 'error',
                  text: this.translateService.instant('Este correo ya se encuentra registrado, ¿Deseas iniciar sesión?'),
                  confirmButtonText: this.translateService.instant('Si, iniciar sesión'),
                  showCancelButton: true,
                  cancelButtonText: this.translateService.instant('No')
                }).then((result) => {
                  if (result.isConfirmed) {
                    //Volver a mostrar el login
                    this.token = undefined;
                    this.showLogin.emit();
                    this.hiddenLink.emit(false);
                    this.formRegister.reset();
                  } else {
                    this.backForm();
                  }
                })
              } else if (messageError == 'Este usuario ya se encuentra registrado') {
                Swal.fire({
                  title: this.translateService.instant('Error'),
                  icon: 'error',
                  text: this.translateService.instant('Este usuario ya se encuentra registrado, ¿Deseas iniciar sesión?'),
                  confirmButtonText: this.translateService.instant('Si, iniciar sesión'),
                  showCancelButton: true,
                  cancelButtonText: this.translateService.instant('No')
                }).then((result) => {
                  if (result.isConfirmed) {
                    //Volver a mostrar el login
                    this.showLogin.emit();
                    this.hiddenLink.emit(false);
                    this.formRegister.reset();
                  } else {
                    this.backForm();
                  }
                })
              }
              else if (messageError == 'código incorrecto') {
                Swal.fire({
                  title: this.translateService.instant('Error'),
                  icon: 'error',
                  text: this.translateService.instant('Código incorrecto')
                })
              } else if (messageError == 'Este código ya expiro o fue usado, solicita otro.') {
                Swal.fire({
                  title: this.translateService.instant('Error'),
                  icon: 'error',
                  text: this.translateService.instant('El código ya venció, debes solicitar uno nuevo')
                }).then(() => {
                  this.backForm();
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

      }
    } else {
      this.formRegister.markAllAsTouched();
    }
  }

  register() {
    if (this.codeVerify != undefined) {
      if (this.token == undefined) {
        Swal.fire({
          title: this.translateService.instant('Error'),
          icon: 'warning',
          text: this.translateService.instant('Parece que aun no has llenado el capchat')
        }).then(() => {
          this.reloadCapchat();
        })
      } else {
        this.loading = true;
        let cleanCode = this.codeVerify.toString().trim();
        let data = {
          username: this.formRegister.get('username').value,
          password: this.formRegister.get('password').value,
          email: this.formRegister.get('email').value,
          token: this.token,
          code: Number(cleanCode),
          link_referral: this.referrals
        }
        this.authenticationService.registerUser(data).subscribe(
          data => {
            this.loading = false;
            this.hiddenLink.emit(false);
            Swal.fire({
              text: this.translateService.instant('Registro exitoso'),
              icon: 'success'
            }).then(() => {
              let data_user = data.data;
              localStorage.setItem('token', data_user.token);
              localStorage.setItem('email', data_user.email);
              localStorage.setItem('username', data_user.username);
              localStorage.setItem('type_user', data_user.type_user);
              localStorage.setItem('link_referrals', data_user.code_referral);
              localStorage.setItem('CurrentLang', 'en');
              this.router.navigate(['/buytoken'])
            })
          },
          error => {
            this.loading = false;
            let messageError = error.error.error;

            if (messageError == 'código incorrecto') {
              // console.log("Entraste acá")
              Swal.fire({
                title: this.translateService.instant('Error'),
                icon: 'error',
                text: this.translateService.instant('Código incorrecto')
              }).then(() => {
                this.reloadCapchat();
              })
            }
            else if(messageError == 'Este código ya expiro o fue usado, solicita otro.'){
              Swal.fire({
                title: this.translateService.instant('Error'),
                icon: 'error',
                text: this.translateService.instant('El código ya venció, debes solicitar uno nuevo')
              }).then(() => {
                this.backForm();
              })
            }
            else if(messageError == 'Este usuario ya se encuentra registrado'){
              Swal.fire({
                title: this.translateService.instant('Error'),
                icon: 'error',
                text: this.translateService.instant('Este usuario ya se encuentra registrado')
              }).then(() => {
                this.backForm();
              })
            }
            else{
              Swal.fire({
                title: this.translateService.instant('Error'),
                icon: 'error',
                text: this.translateService.instant('Ha ocurrido un error, inténtalo más tarde')
              })
            }
            
          })
      }
    } else {
      this.loading = false;
      Swal.fire({
        title: this.translateService.instant('Error'),
        icon: 'warning',
        text: this.translateService.instant('Debes digitar el código')
      })
    }
  }


}
