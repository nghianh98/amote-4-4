import configs from '_/helpers/configs';
import { SELECTORS, THEME_ID_DEFAULT } from '_/modules/reward/constants';

declare global {
	interface Window {
		Shopify: any;
	}
}

namespace Utils {
	export function isStorefront(): boolean {
		return !isLocal();
	}

	export function isLocal(): boolean {
		return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
	}

	export function createElementFromHTML(htmlString: string): Element | null {
		var div = document.createElement('div');
		div.innerHTML = htmlString.trim();

		return div.firstElementChild;
	}

	export function addStylesCustom(cssString = ''): void {
		const styleElement: any = document.createElement('style');
		styleElement.type = 'text/css';
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = cssString;
		} else {
			styleElement.appendChild(document.createTextNode(cssString));
		}

		document.head.appendChild(styleElement);
	}

	export function getQuoteByPage(quotes: any) {
		const result = quotes && Array.isArray(quotes) && quotes.find((item) => item?.page === 'cart');
		return result;
	}

	export function mergeData(obj1: any, obj2: any, concatKeys: Array<string>) {
		const mergedObj = Object.assign({}, obj1, obj2);

		concatKeys.forEach((key: string) => {
			if (obj2[key]) {
				mergedObj[key] = obj1[key].concat(obj2[key]);
			}
		});

		return mergedObj;
	}

	export function amoteMutation(target: Element, widget: string, cb: Function) {
		if (target) {
			const observer = new MutationObserver((mutations: MutationRecord[], observer: MutationObserver) => {
				let isAddedApp = false;

				mutations.forEach((mutation) => {
					const mutationTypes = ['childList'];

					if (mutationTypes.includes(mutation.type)) {
						const addedNodes: NodeList = mutation.addedNodes;
						const removedNodes: NodeList = mutation.removedNodes;

						if (
							checkExistWidgetMutation(addedNodes, widget) ||
							checkExistWidgetMutation(removedNodes, widget)
						) {
							isAddedApp = true;
						}
					}
				});

				if (!isAddedApp) {
					const elemtWidget = target.querySelector(`.amote-app[widget="${widget}"]`);
					if (!elemtWidget) {
						cb();
					}
				}
			});

			observer.observe(target, {
				childList: true,
				subtree: true
			});
		}
	}

	export function amoteMutationAllType(targetElement: Element, cb: Function) {
		if (targetElement) {
			// Create a new MutationObserver
			const observer = new MutationObserver((mutationsList, observer) => {
				let change = false;
				// const mutationTypes = ['childList'];
				for (const mutation of mutationsList) {
					const target: any = mutation.target;
					const isChangeTextStatus = target?.className?.includes('reward__text-status');
					const isChangeTextUnlock = target?.className?.includes('reward__text-unlock');

					if (!(isChangeTextStatus || isChangeTextUnlock)) {
						change = true;
					}
				}

				if (change) {
					cb(observer);
				}
			});

			observer.observe(targetElement, {
				characterData: true,
				characterDataOldValue: true,
				childList: true,
				subtree: true
			});
		}
	}

	function checkExistWidgetMutation(nodes: NodeList, widgetName: string) {
		let check = false;
		nodes.forEach((node: Node) => {
			const eHtml = node as HTMLElement;
			const className = eHtml.className;
			const attrWidget = className ? eHtml.getAttribute('widget') : '';
			if (className && String(className).includes('amote-app') && attrWidget === widgetName) {
				check = true;
			}
		});

		return check;
	}

	export function checkExistWidgetInElement(element: any, widget: string) {
		const elmntWidget = element.querySelectorAll(`.amote-app[widget="${widget}"]`);
		return elmntWidget.length;
	}

	export function getShadowDomTypes(shadowDomTypes: any): any {
		const shadowDomType: any = [];

		shadowDomTypes.forEach((itemSelector: any) => {
			document.querySelector(itemSelector.host) && shadowDomType.push(itemSelector);
		});

		return shadowDomType;
	}

	export function getIframeTypes(iframeTypes: any): any {
		const iframeType: any = [];

		iframeTypes.forEach((itemSelector: any) => {
			document.querySelector(itemSelector.wrapper) && iframeType.push(itemSelector);
		});

		return iframeType;
	}

	// reward
	export function setAttributeBody(attr: string, value: any) {
		document.body.setAttribute(attr, value);
	}

	export function getRewardSelector(): any {
		const selectorsByTheme: any = SELECTORS;
		let themeID = THEME_ID_DEFAULT;

		if (window.Shopify) {
			themeID = window.Shopify.theme.theme_store_id;
		}

		if (!selectorsByTheme[themeID]) {
			return selectorsByTheme[THEME_ID_DEFAULT];
		} else {
			return selectorsByTheme[themeID];
		}
	}

	export function isObjectEmpty(obj: Object) {
		return Object.keys(obj).length === 0 && obj.constructor === Object;
	}

	export function mockDataLocal(item_count = 1): Promise<void> {
		const pricePerItem = 40;
		const total_discount = 200;
		const cartInfo = new Promise<any>((resolve) => {
			setTimeout(() => {
				resolve({
					data: {
						item_count,
						original_total_price: item_count * pricePerItem,
						total_price: item_count * pricePerItem - total_discount, // apply discount
						total_discount,
						items_subtotal_price: item_count * pricePerItem
					}
				});
			}, 1000);
		});

		return cartInfo;
	}

	export function snakeToCamel(str: string) {
		return str.replace(/_([a-z])/g, function (match, letter) {
			return letter.toUpperCase();
		});
	}

	export function convertSelectorFromDB(snake_case_selectors: any): any {
		if (snake_case_selectors && !isObjectEmpty(snake_case_selectors)) {
			let camelCaseSelectors: any = {};

			for (let key in snake_case_selectors) {
				camelCaseSelectors[snakeToCamel(key)] = {};

				for (let key2 in snake_case_selectors[key]) {
					camelCaseSelectors[snakeToCamel(key)][snakeToCamel(key2)] = snake_case_selectors[key][key2];
				}
			}

			return camelCaseSelectors;
		} else {
			return null;
		}
	}

	export function roundingPrice(price: any, notRate = false): any {
		if (window.Shopify && !notRate) {
			let rate = window.Shopify.currency.rate;

			if (Number(rate) !== 1) {
				let rounding = 1000;

				const priceByRate: any = price * Number(rate);

				if (digitsCount(priceByRate) >= 5) {
					return Math.ceil(priceByRate.toFixed() / rounding) * rounding;
				} else {
					return priceByRate;
				}
			}
		}

		return price;
	}

	export function getOffset(el: any): any {
		if (el) {
			var _x = 0;
			var _y = 0;
			while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
				_x += el.offsetLeft - el.scrollLeft;
				_y += el.offsetTop - el.scrollTop;
				el = el.offsetParent;
			}
			return { top: _y, left: _x };
		} else {
			return {
				left: 0,
				top: 0
			};
		}
	}

	export function formatCurrency(number: number): any {
		try {
			if (window.Shopify && window.navigator) {
				const country = window.Shopify.country;
				const currency = window.Shopify.currency.active;
				const languages = window.navigator.languages;

				if (languages.length > 0) {
					const format = languages.find((item) => item.includes(`-${country}`));
					const fmt = new Intl.NumberFormat(format, {
						style: 'currency',
						currency
					});

					return fmt.format(number);
				}
			} else {
				return number;
			}
		} catch (error) {
			return number;
		}
	}

	export function replaceAllTag(str: string, obj: any) {
		for (const x in obj) {
			str = str.replace(new RegExp(`{${x}}`, 'g'), obj[x]);
		}
		return str;
	}

	export function convertTextTagToHtml(text: string, tags: Object = {}): string {
		if (text) {
			return replaceAllTag(text, tags) || '';
		}

		return '';
	}

	export function rgbToHex(rgb: any) {
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return rgb && rgb.length === 4
			? '#' +
					('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
					('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
					('0' + parseInt(rgb[3], 10).toString(16)).slice(-2)
			: '';
	}

	export function hexToRgbA(hex: string, opacity: number): string {
		var c: any = [];
		if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
			c = hex.substring(1).split('');
			if (c.length == 3) {
				c = [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c = '0x' + c.join('');
			return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${opacity})`;
		}
		throw new Error('Bad Hex');
	}

	export function convertLabelName(tier: any): string {
		const { label, reward } = tier;
		const { name, discount } = reward;

		if (name !== 'discount') return label;

		if (discount) {
			const { type, value } = discount;
			const valueFormat = type === 'fixedAmount' ? formatCurrency(roundingPrice(value)) : value + '%';
			const tags = {
				discount_rate: `<b>${valueFormat}</b>`,
				discount: `<b>${valueFormat}</b>`
			};

			return convertTextTagToHtml(label, tags);
		}

		return '';
	}

	export function checkMaxDiscount(listDiscount: any): any {
		let max = 0;
		let indexMax = 0;
		if (listDiscount.length > 0) {
			listDiscount.forEach((item: any, index: number) => {
				const {
					minimum_amount,
					reward: { discount }
				} = item;
				const { type, value } = discount;

				let discountVal = type === 'fixedAmount' ? value : (minimum_amount * value) / 100;

				if (discountVal > max) {
					max = discountVal;
					indexMax = index;
				}
			});

			return listDiscount[indexMax];
		}

		return listDiscount[0];
	}

	export function digitsCount(n: number) {
		var count = 0;
		if (n >= 1) ++count;

		while (n / 10 >= 1) {
			n /= 10;
			++count;
		}

		return count;
	}

	export function setCookieByDay(cname: string, cvalue: string, exdays: number) {
		console.log(exdays);
		const d = new Date();
		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
		let expires = 'expires=' + d.toUTCString();
		document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
	}

	export function setCookieBySecond(cname: string, cvalue: string, exsecond: number) {
		const d = new Date();
		d.setTime(d.getTime() + exsecond * 1000);
		let expires = 'expires=' + d.toUTCString();
		document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
	}

	export function getCookie(cname: string) {
		let name = cname + '=';
		let ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}

	export function getProductImage(productImages: any) {
		const noImage = configs.images.noImage;
		const item = productImages && productImages[0];
		const image = item && item.src ? item.src : noImage;
		return image;
	}

	export function shuffleArray(array: any) {
		let currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex > 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
	}
}

export default Utils;
