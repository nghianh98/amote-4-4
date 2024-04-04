import configs from '_/helpers/configs';
import Utils from '_/helpers/utils';
import Appearances from './appearances';
import Services from '_/services';

class Quotes {
	private data = configs.default.quote;
	private appearances = new Appearances();
	private styleId: string = 'amote-styled';

	async render(): Promise<void> {
		await this.fetchData();

		if (!Utils.isStorefront()) {
			this.renderQuoteOnLocal();
		} else {
			this.renderQuoteOnStore();
		}
	}

	private async fetchData(): Promise<void> {
		try {
			const services = new Services();
			const data = await services.getQuotes();
			let dataQuoteCart = Utils.getQuoteByPage(data) || this.data;

			const concatKeys = ['mutations', 'iframeDomSelectors', 'shadowDomSelectors'];
			const dataMerge = Utils.mergeData(this.data, dataQuoteCart, concatKeys);
			this.data = dataMerge;
			this.addAttributeBody();
		} catch (error) {
			console.error(error);
		}
	}

	renderQuoteOnLocal(): void {
		const bodySelector = document.querySelector('body');
		const htmlQuote = this.getHTMLQuote();
		const elementQuote: any = Utils.createElementFromHTML(htmlQuote);

		if (bodySelector) {
			bodySelector.appendChild(elementQuote);
		}
	}

	addAttributeBody() {
		if (this.data.is_active) {
			document.body.setAttribute('amote-quote', 'true');
		}
	}

	getHTMLQuote() {
		return this.appearances.createMarkup(this.data);
	}

	renderQuoteOnStore(): void {
		const { is_active } = this.data;

		if (is_active) {
			this.handleStyleCss();
			this.handleRenderQuote();
			this.handleMutation();
			this.handleTrigger();
			this.handleMutationShadowDOM();
			this.handleMutationIframe();
		}
	}

	getAppBlockQuote(): any {
		return document.querySelector(configs.appBlock.quote);
	}

	handleStyleCss() {
		const { styleCss } = this.data;

		if (styleCss) {
			Utils.addStylesCustom(styleCss);
		}
	}

	handleRenderQuote() {
		const appBlockQuote = this.getAppBlockQuote();
		if (appBlockQuote) {
			this.insertQuote(appBlockQuote, true);

			this.handleQuoteOnDrawerAndPopup();
		} else {
			const shopify = window.Shopify;
			if (shopify && shopify.theme.name === 'Dawn') {
				// theme Dawn
				this.handleSelectorThemeDawn();
			} else {
				this.handleSelector();
				this.handleSelectorShadowDom();
			}
			this.handleSelectorIframe();
		}
	}

	handleQuoteOnDrawerAndPopup() {
		const { drawers, popups } = this.data;
		const listElement = [...drawers, ...popups];
		listElement.forEach(({ wrapper, selectors }) => {
			selectors.forEach((selector: string) => {
				const elmtBtnCheckoutList = document.querySelectorAll(wrapper + ' ' + selector);
				if (elmtBtnCheckoutList && elmtBtnCheckoutList.length > 0) {
					elmtBtnCheckoutList.forEach((elmt) => {
						this.insertQuote(elmt);
					});
				}
			});
		});
	}

	handleSelectorThemeDawn() {
		const selectors = configs.selectorsThemeDawn;

		selectors.map((selector) => {
			const elmtCTA = document.querySelectorAll(selector);
			if (elmtCTA && elmtCTA.length > 0) {
				elmtCTA.forEach((elmt) => {
					this.insertQuote(elmt);
				});
			}
		});
	}

	handleSelector() {
		let selectors: any = this.data.selectors;
		if (!selectors.length) {
			selectors = configs.default.quote.selectors;
		}

		selectors.forEach((selector: string) => {
			const elmtBtnCheckoutList = document.querySelectorAll(selector);
			if (elmtBtnCheckoutList && elmtBtnCheckoutList.length > 0) {
				elmtBtnCheckoutList.forEach((elmt) => {
					this.insertQuote(elmt);
				});
			}
		});
	}

	handleSelectorShadowDom() {
		const { shadowDomTypes } = this.data;

		shadowDomTypes.forEach((shadowDomType: any) => {
			const shadowHost = document.querySelector(shadowDomType.host);

			if (shadowHost) {
				const shadowRoot = shadowHost.shadowRoot;

				if (shadowRoot) {
					let selectors: any = this.data.selectors;
					if (!selectors.length) {
						selectors = configs.default.quote.selectors;
					}

					selectors.forEach((selector: string) => {
						const elmtBtnCheckoutList = shadowRoot.querySelectorAll(selector);
						if (elmtBtnCheckoutList && elmtBtnCheckoutList.length > 0) {
							elmtBtnCheckoutList.forEach((elmt: any) => {
								this.insertQuote(elmt);
							});
						}
					});
				}
			}
		});
	}

	handleSelectorIframe() {
		const { iframeTypes } = this.data;

		iframeTypes.forEach((iframeType: any) => {
			const iframeWrapperSelector = document.querySelector(iframeType.wrapper);

			if (iframeWrapperSelector) {
				const iframeSelector = iframeWrapperSelector.querySelector('iframe')?.contentWindow?.document;

				if (iframeSelector) {
					const elemntIframe = iframeSelector.querySelector(iframeType.mutation);

					let selectors: any = this.data.selectors;
					if (!selectors.length) {
						selectors = configs.default.quote.selectors;
					}

					selectors.forEach((selector: string) => {
						const elmtBtnCheckoutList = elemntIframe.querySelectorAll(selector);
						if (elmtBtnCheckoutList && elmtBtnCheckoutList.length > 0) {
							elmtBtnCheckoutList.forEach((elmt: any) => {
								this.insertQuote(elmt);
							});
						}
					});
				}
			}
		});
	}

	insertQuote(elemnt: any, isAppBlock = false): void {
		const { position } = this.data;

		if (elemnt && !Utils.checkExistWidgetInElement(elemnt, 'quote')) {
			const htmlQuote = this.getHTMLQuote();

			if (isAppBlock) {
				elemnt.innerHTML = htmlQuote;
			} else {
				const elemntParent = elemnt.parentElement;

				if (elemntParent && !Utils.checkExistWidgetInElement(elemntParent, 'quote')) {
					const pstInsert = position === 'aboveCheckoutButton' ? 'beforebegin' : 'afterend';

					elemnt.insertAdjacentHTML(pstInsert, htmlQuote);
				}
			}
		}
	}

	handleMutation() {
		const mutations = this.data.mutations || [];
		let interval: any = null;
		let detectList: any = []; // interval until DOM has element mutation
		interval = setInterval(() => {
			if (detectList.length === mutations.length) {
				clearInterval(interval);
			}

			mutations.forEach((selector) => {
				const elmnt = document.querySelector(selector);
				if (elmnt) {
					if (!detectList.includes(selector)) {
						detectList.push(selector);

						Utils.amoteMutation(elmnt, 'quote', () => {
							this.handleRenderQuote();
						});
					}
				} else {
					const index = detectList.findIndex((item: any) => item === selector);
					if (index != -1) {
						detectList.splice(index, 1);
					}
				}
			});
		}, 200);

		setTimeout(() => {
			clearInterval(interval);
		}, 5 * 60 * 1000); // 5 minutes
	}

	handleTrigger() {
		try {
			const { classList, timer } = this.data.trigger;

			if (classList && classList.length > 0) {
				classList.forEach((selector: string) => {
					const elmtTrigger = document.querySelector(selector);

					if (elmtTrigger) {
						elmtTrigger.addEventListener('click', () => {
							setTimeout(() => {
								this.handleRenderQuote();
							}, timer);
						});
					}
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	handleMutationShadowDOM() {
		try {
			const shadowDomTypes = Utils.getShadowDomTypes(this.data.shadowDomTypes);

			if (shadowDomTypes.length) {
				shadowDomTypes.forEach((shadowDomType: any) => {
					const shadowHost = document.querySelector(shadowDomType.host);

					if (shadowHost) {
						const shadowRoot = shadowHost.shadowRoot;

						if (shadowRoot) {
							const elemntShadow = shadowRoot.querySelector(shadowDomType.mutation);
							if (elemntShadow) {
								if (!shadowRoot.querySelector(`#${this.styleId}`)) {
									const markupStyle = document.createElement('div');
									const styles = document.querySelector(`#${this.styleId}`);

									if (styles) {
										markupStyle.id = this.styleId;
										markupStyle.innerHTML = styles.innerHTML;
										shadowRoot.append(markupStyle);
									}
								}

								Utils.amoteMutation(elemntShadow, 'quote', () => {
									this.handleRenderQuote();
								});
							}
						}
					}
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	handleMutationIframe() {
		try {
			const iframeTypes = Utils.getIframeTypes(this.data.iframeTypes);

			if (iframeTypes.length) {
				iframeTypes.forEach((iframeType: any) => {
					const iframeWrapperSelector = document.querySelector(iframeType.wrapper);

					if (iframeWrapperSelector) {
						const iframeSelector = iframeWrapperSelector.querySelector('iframe')?.contentWindow?.document;

						if (iframeSelector) {
							const elemntIframe = iframeSelector.querySelector(iframeType.mutation);
							const iframeBody = iframeSelector.body;

							if (iframeBody) {
								if (!iframeBody.querySelector(`#${this.styleId}`)) {
									const markupStyle = iframeSelector.createElement('div');
									const styles = document.querySelector(`#${this.styleId}`);

									if (styles) {
										markupStyle.id = this.styleId;
										markupStyle.innerHTML = styles.innerHTML;
										iframeBody.append(markupStyle);
									}
								}

								Utils.amoteMutation(elemntIframe, 'quote', () => {
									this.handleRenderQuote();
								});
							}
						}
					}
				});
			}
		} catch (error) {
			console.log(error);
		}
	}
}

export default Quotes;
