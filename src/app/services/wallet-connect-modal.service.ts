import { Injectable } from '@angular/core';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';
import { waitForTransaction, configureChains, createConfig, getAccount, prepareWriteContract, writeContract, fetchBalance, getWalletClient, watchAccount, getContract, sepolia, disconnect, readContract } from '@wagmi/core';

import { mainnet, polygon, arbitrum, bscTestnet, bsc, goerli } from '@wagmi/core/chains';

import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { parseGwei } from 'viem';




const chains = [arbitrum, mainnet, polygon, bscTestnet, sepolia, bsc, goerli]
const projectId = "1511a76bbb77ff13009997dc574725e7";

const abi = environment.abiFocusForTokens;
const abiUsdt = environment.abiUsdt;
const abiNfts = environment.abiFocusForNFTs;

const adrressOfNfts: any = environment.adrressOfNfts;
const addressContractFocus: any = environment.addressContractFocus;
const addressContractBlumer:any = environment.addressContractBlumer;
const addressContractUsdt: any = environment.addressContractUsdt;


const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
	autoConnect: true,
	connectors: w3mConnectors({ projectId, chains }),
	publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)
const web3modal = new Web3Modal({ projectId }, ethereumClient)

let account;

declare let window: any;

@Injectable({
	providedIn: 'root'
})

export class WalletConnectModalService {
	textForLoading;

	private accountSubject = new Subject<any>();
	private statusModal = new Subject<any>();

	constructor(private translateService: TranslateService) {
		// console.log("HOLA ENTRASTE EN EL SERVICIO DEL MODAL")
		account = getAccount(); //Obtenemos la cuenta actual.
		// console.log("Cuenta actual: ", account)
		this.DetectChangeAccount(); // Nos suscribimos a los cambio de conexión de la cuenta.
	}

	/**
	 * Función para abrir el modal de conexión con la wallet
	 */
	async openModal() {
		let modalOpen;
		modalOpen = await web3modal.openModal();
	}

	/**
	 * Función que se suscribe a cualquier cambio que haya en la ventana del modal (si se cierra y abre basicamente)
	 * @returns valor del modal, observable (true si esta abierto, false si esta cerrado)
	 */
	subscribeModal(): Observable<any> {
		const unsubscribe = web3modal.subscribeModal((newState) => {
			this.statusModal.next(newState);
		})
		return this.statusModal.asObservable();
	}

	async disconnectAccount() {
		await disconnect();
	}

	/**
	 * retorna el valor de la cuenta actual.
	 * @returns Cuenta actual
	 */
	async getAccount() {
		if (account.isConnected) {
			return account;
		} else {
			return false;
		}
	}

	/**
	 * Obtiene el balance general de la wallet en usdt.
	 */
	async getBalanceUsdt() {
		let account = getAccount();
		// console.log("Account: ", account)
		if (account.address != undefined) {
			const data = await readContract({
				address: addressContractFocus,
				abi: abi,
				functionName: 'balancesUsdt',
				args: [account.address]
			})
			let balanceFormat = ((Number(data) * 10 ** -18)).toFixed(3);
			return balanceFormat;
		} else {
			// Swal.fire({
			// 	text: 'Account adrress es indefinido'
			// })
			return false;
		}
		// console.log("El balance es: ", ((Number(data)* 10 ** -18)).toFixed(3))
	}

	/**
	 * Obtiene el balance general de la wallet en blr.
	 */
	async getBalanceBlr() {
		let account = getAccount();
		// console.log("Account: ", account)
		if (account.address != undefined) {
			const data = await readContract({
				address: addressContractFocus,
				abi: abi,
				functionName: 'balancesBrl',
				args: [account.address]
			})
			let balanceFormat = ((Number(data) * 10 ** -18)).toFixed(3);
			return balanceFormat;
		} else {
			// Swal.fire({
			// 	text: 'Account adrress es indefinido'
			// })
			return false;
		}
		// console.log("El balance es: ", ((Number(data)* 10 ** -18)).toFixed(3))
	}

	/**
	 * Obtiene los NFTs disponibles
	 * @returns Nft disponibles
	 */
	async nftAvailable(type_nft) {
		let account = getAccount();
		if (account.address != undefined) {
			const data = await readContract({
				address: adrressOfNfts,
				abi: abiNfts,
				functionName: type_nft
			})
			return data;
		} else {
			return false;
		}
	}

	/**
	 * Detecta los cambios generados en la cuenta, más que todo es para los cambios de conexión
	 */
	DetectChangeAccount() {
		const unwatch = watchAccount((account_) => {
			this.accountSubject.next(account_);
			account = account_;
		})
	}

	/**
	 * devuelve el valor de la cuenta como un observable
	 * @returns valor de la cuenta 
	 */
	getAccountChanges(): Observable<any> {
		// console.log("Detectando cambios..")
		return this.accountSubject.asObservable();
	}


	/**
 * Función para comprar Nfts. (cambia usdts a blr)
 * @param dataForsend Wallets, porcentajes y valor en usdt
 * @returns {string} hashSellToken
 */
	async buyNft(dataForsend) {
		// console.log("data a enviar: ", dataForsend)
		this.textForLoading = "Aprueba tu saldo para realizar la transacción";
		let dataReturn;
		let hashSellToken;
		let valueToSend = (dataForsend.usdt * 10 ** 18);
		try {
			const config = await prepareWriteContract({
				address: addressContractUsdt,
				abi: abiUsdt,
				functionName: 'approve',
				args: [adrressOfNfts, valueToSend]
			});

			const { hash } = await writeContract(config);
			this.textForLoading = "Por favor espera un momento";
			const data = await waitForTransaction({
				hash,
			}).then(async (result) => {
				if (result.status == "success") {
					this.textForLoading = "Confirma tu compra, no recargues la página en el proceso";
					try {
						const config = await prepareWriteContract({
							address: adrressOfNfts,
							abi: abiNfts,
							functionName: 'sellNFT',
							args: [dataForsend.id, valueToSend, Number(dataForsend.type_nft), dataForsend.token_uri, dataForsend.porcentage, dataForsend.wallets, dataForsend.wallet_sp]
						});

						const { hash } = await writeContract(config);
						hashSellToken = hash;
						this.textForLoading = "Por favor espera un momento";
						const data = await waitForTransaction({
							hash,
						}).then((result) => {
							// console.log("Resultado FROm: ", result.from);
							if (result.status == "success") {
								dataReturn = {
									address_send: result.from,
									hash: hashSellToken,
									status: true
								}
								Swal.fire({
									text: this.translateService.instant('Transacción exitosa'),
									icon: 'success'
								});
							} else {
								dataReturn = {
									hash: hashSellToken,
									status: false
								}
								Swal.fire({
									text: this.translateService.instant('Algo salió mal'),
									icon: 'error'
								});
							}
						},
							error => {
								let errorString = error.toString();
								this.errorHandler(errorString);
							});

					} catch (error) {
						console.log(error);
						let errorString = error.toString();
						this.errorHandler(errorString);
						console.log(errorString);
					}


				} else {
					Swal.fire({
						text: this.translateService.instant('Algo salió mal'),
						icon: 'error'
					});
				}
			},
				error => {
					Swal.fire({
						text: this.translateService.instant('Algo salió mal'),
						icon: 'error'
					});
					console.log("Error: ", error);
				});
			return dataReturn;
		} catch (error) {
			console.log(error);
			let errorString = error.toString();
			this.errorHandler(errorString);
			console.log(errorString);
			return false;
		}
	}


	/**
	 * Función para comprar tokens. (cambia usdts a blr)
	 * @param dataForsend Wallets, porcentajes y valor en usdt
	 * @returns {string} hashSellToken
	 */
	async buyToken(dataForsend) {
		// console.log("Data a enviar: ", dataForsend)
		this.textForLoading = "Aprueba tu saldo para realizar la transacción";
		let dataReturn;
		let hashSellToken;
		let valueToSend = (dataForsend.usdt * 10 ** 18);
		try {
			const config = await prepareWriteContract({
				address: addressContractUsdt,
				abi: abiUsdt,
				functionName: 'approve',
				args: [addressContractFocus, valueToSend]
			});

			const { hash } = await writeContract(config);
			this.textForLoading = "Por favor espera un momento";
			const data = await waitForTransaction({
				hash,
			}).then(async (result) => {
				if (result.status == "success") {
					this.textForLoading = "Confirma tu compra, no recargues la página en el proceso";
					try {
						const config = await prepareWriteContract({
							address: addressContractFocus,
							abi: abi,
							functionName: 'sellToken',
							args: [valueToSend, dataForsend.porcentage, dataForsend.wallets, dataForsend.wallet_sp]
						});

						const { hash } = await writeContract(config);
						hashSellToken = hash;
						this.textForLoading = "Por favor espera un momento";
						const data = await waitForTransaction({
							hash,
						}).then((result) => {
							// console.log("Resultado: ", result);



							if (result.status == "success") {
								dataReturn = {
									address_send: result.from,
									hash: hashSellToken,
									status: true
								}
								Swal.fire({
									text: this.translateService.instant('Transacción exitosa'),
									icon: 'success'
								});
							} else {
								dataReturn = {
									hash: hashSellToken,
									status: false
								}
								Swal.fire({
									text: this.translateService.instant('Algo salió mal'),
									icon: 'error'
								});
							}
						},
							error => {
								let errorString = error.toString();
								this.errorHandler(errorString);
							});

					} catch (error) {
						console.log(error);
						let errorString = error.toString();
						this.errorHandler(errorString);
						console.log(errorString);
					}


				} else {
					Swal.fire({
						text: this.translateService.instant('Algo salió mal'),
						icon: 'error'
					});
				}
			},
				error => {
					Swal.fire({
						text: this.translateService.instant('Algo salió mal'),
						icon: 'error'
					});
					console.log("Error: ", error);
				});
			return dataReturn;
		} catch (error) {
			console.log(error);
			let errorString = error.toString();
			this.errorHandler(errorString);
			console.log(errorString);
			return false;
		}
	}


	async addNft(data_received) {
		// console.log("Entro a addNft")
		// if(account.isConnected){
		let valueToSend = data_received.price * 10 ** 18;
		this.textForLoading = "Confirma la creación de este NFT en tu wallet";
		try {
			const config = await prepareWriteContract({
				address: adrressOfNfts,
				abi: abiNfts,
				functionName: 'createNFT',
				args: [data_received.uri, data_received.idNft, valueToSend]
			});
			const { hash } = await writeContract(config);
			this.textForLoading = "Espera un momento"
			try {
				const result = await waitForTransaction({ hash });

				let dataReturn;
				if (result.status == 'success') {
					// ÉXITO
					// console.log("Se guardo todo bien.")
					dataReturn = true;
				} else {
					Swal.fire({
						text: this.translateService.instant('Algo salió mal'),
						icon: 'error'
					});
					dataReturn = false;
				}
				this.textForLoading = 'Cargando';
				return dataReturn;
			} catch (error) {
				// Manejo de errores de waitForTransaction
				console.log("ERROR: ", error)
				let errorString = error.toString();
				this.errorHandler(errorString);
				return false;
			}
		} catch (error) {
			console.log("ERROR: ", error)
			let errorString = error.toString();
			this.errorHandler(errorString);
			return false;
		}
		// }else{

		// }



	}



	errorHandler(errorString: string) {
		
		if (errorString.includes('Insufficient USDT balance')) {
			Swal.fire({
				icon: 'error',
				text: this.translateService.instant('Saldo USDT insuficiente')
			})
		}
		else if (errorString.includes('User rejected the request')) {
			Swal.fire({
				icon: 'error',
				text: this.translateService.instant('La transacción fue cancelada')
			})
		}
		else if (errorString.includes('Insufficient allowance. Please approve the contract to spend USDT.')){
			Swal.fire({
				icon: 'error',
				text: this.translateService.instant('Insuficientes USDT aprobados')
			})
		}else
		if (errorString.includes('Unauthorized withdrawal address')) {
			Swal.fire({
				icon: 'error',
				text: this.translateService.instant('La wallet master no está autorizada')
			})
		}
		else if(errorString.includes('USDT transfer failed')){
			Swal.fire({
				icon: 'error',
				text: this.translateService.instant('La transferencia de USDT fallo')
			})
		}
		else if(errorString.includes('No withdrawal addresses are set.')){
			Swal.fire({
				icon: 'error',
				text: this.translateService.instant('No hay direccion de wallet master')
			})
		}
		else if(errorString.includes('No permissions.')){
			Swal.fire({
				icon: 'error',
				text: this.translateService.instant('No cuentas con los permisos necesarios para realizar esta acción')
			})
		}
		else if (errorString.includes('no permissions to create nfts')) {
			Swal.fire({
				icon: 'error',
				text: this.translateService.instant('Esta wallet no es la administradora, por lo tanto no puedes subir NFTs')
			})
		}
		else if (errorString.includes('Connector not found')) {
			Swal.fire({
				text: this.translateService.instant('Conecta tu wallet y vuelve a intentarlo'),
				icon: 'error'
			}).then(() => {
				document.getElementById('closeModal')?.click();
				document.getElementById('btn-connect-wallet')?.click();
			});
		}
		else if(errorString.includes('transfer from incorrect owner')){
			Swal.fire({
				text: this.translateService.instant('Parece que esto ya pertenece a otro usuario'),
				icon: 'error'
			}).then(() => {
				/**
				 * Dado que este error se da cuando el nft ya esta comprado lo quep procede es cerra el modal si esta abierto y volver a llamar al metodo de trae los nfts 
				 */
				document.getElementById('closeModal')?.click();
				// document.getElementById('callAllNfts')?.click();
			});
		}
		else if (errorString.includes('transfer amount exceeds balance')) {
			Swal.fire({
				text: this.translateService.instant('Saldo insuficiente'),
				icon: 'error'
			}).then(() => {
				/**
				 * Dado que este error se da cuando el nft ya esta comprado lo quep procede es cerra el modal si esta abierto y volver a llamar al metodo de trae los nfts 
				 */
				document.getElementById('closeModal')?.click();
				// document.getElementById('callAllNfts')?.click();
			});
		}
		else {
			Swal.fire({
				icon: 'error',
				text: this.translateService.instant('Ha ocurrido un error')
			})
		}
	}

	/**
	 * Importa el token de BLR a la wallet del usuario
	 * @returns resultado de la acción. true para correcto, false para incorrecto
	 */
	async importTokenBlR() {
		const result = await typeof window.ethereum.request({
			method: 'wallet_watchAsset',
			params: {
				type: 'ERC20', // Initially only supports ERC-20 tokens, but eventually more!
				options: {
					address: addressContractBlumer, // The address of the token.
					symbol: 'BLRE', // A ticker symbol or shorthand, up to 5 characters.
					decimals: 18, // The number of decimals in the token.
					// image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/2048px-Bitcoin.svg.png', // A string URL of the token logo.
				},
			},
		});
		return result;
	}
}
