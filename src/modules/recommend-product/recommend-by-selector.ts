import Utils from '_/helpers/utils';
import Services from '_/services';
import Appearances from './appearances';

class RecommendBySelector {
	private services = new Services();
	private settings: any = null;
	private appearances: any = null;
	private selector: any = null;
	private elemntWrapper: any = null;
	private elemntList: any = null;
	private currentProductVariant: any = {};
	private variantSelected: any = [];
	private idVariantsInstock: any[] = [];

	// selectors
	private selectorProduct = ".amote-app[widget='recommend-product']";
	private selectorProductList = `${this.selectorProduct} .RecommendProduct__list`;
	private selectorBtnPrev = `${this.selectorProduct} .RecommendProduct__btnPrev`;
	private selectorBtnNext = `${this.selectorProduct} .RecommendProduct__btnNext`;
	private selectorProductVariant = ".amote-app[widget='product-variant']";
	private selectorBtnShowVariant = `${this.selectorProduct} .RecommendProduct__item__actions button`;
	private selectorProductVariantContent = `${this.selectorProductVariant} .product-variant__content`;
	private selectorBtnAddToCart = `${this.selectorProductVariant} .RecommendProduct__options button`;
	private selectorOptionItem = `${this.selectorProductVariant} .RecommendProduct__options__item`;
	private selectorVariantValue = `${this.selectorProductVariant} .RecommendProduct__values__item`;
	private selectorValueList = `${this.selectorProductVariant} .RecommendProduct__values__list`;

	init(settings: any, selector: any) {
		this.settings = { ...settings };
		this.selector = { ...selector };

		const _appearances = new Appearances();
		_appearances.load(this.settings);
		this.appearances = _appearances;

		this.render();
	}

	render() {
		const { timeoutRender = 0 } = this.selector;

		setTimeout(() => {
			this.handleRenderHTML();
			this.handleMutation();
		}, timeoutRender);
	}

	handleRenderHTML() {
		this.handleRenderRecommendProductBySelector();
	}

	handleMutation() {
		let interval: any = null;

		interval = setInterval(() => {
			const { wrapper } = this.selector;
			const elmntWrapper = document.querySelector(wrapper);

			if (elmntWrapper) {
				clearInterval(interval);
			}

			// case rerender all
			Utils.amoteMutationAllType(elmntWrapper, () => {
				const elmntProduct = elmntWrapper.querySelector(this.selectorProduct);
				if (!elmntProduct) {
					this.handleRenderHTML();
				}
			});
		}, 500);
	}

	handleRenderRecommendProductBySelector() {
		const { wrapper, productList: selectorList, cartType, position } = this.selector;
		this.elemntWrapper = document.querySelector(wrapper);

		if (this.elemntWrapper) {
			const elmntProduct = this.elemntWrapper.querySelector(this.selectorProduct);

			if (!elmntProduct) {
				this.elemntList = this.elemntWrapper.querySelector(selectorList);

				// progress bar
				if (this.elemntList) {
					const htmlRecommendProduct: any = this.appearances.getHTMLRecommnedProduct(cartType);
					const elmntRecommendProduct: any = Utils.createElementFromHTML(htmlRecommendProduct);

					if (position === 'before') {
						this.elemntList.before(elmntRecommendProduct);
					} else if (position === 'after') {
						this.elemntList.after(elmntRecommendProduct);
					} else {
						this.elemntList.appendChild(elmntRecommendProduct);
					}
					this.handleSetEventShowVariant();
					this.handleDetectResize();
				}
			}
		}
	}

	handleCheckShowScroll() {
		const slider = this.elemntWrapper.querySelector(this.selectorProductList);
		const isScroll = slider.scrollWidth > slider.parentElement.offsetWidth;
		const btnPrev = this.elemntWrapper.querySelector(this.selectorBtnPrev);
		const btnNext = this.elemntWrapper.querySelector(this.selectorBtnNext);

		btnPrev.style.display = !isScroll ? 'none' : 'flex';
		btnNext.style.display = !isScroll ? 'none' : 'flex';
	}

	handleDetectResize() {
		this.handleCheckShowScroll();
		window.addEventListener('resize', () => this.handleCheckShowScroll());
	}

	async getInfoVariant(variants: any) {
		const services = new Services();
		// const promiseList = [await services.getInfoVariant(variants[0].id)]
		const promiseList = variants.map(async (item: any) => await services.getInfoVariant(item.id));
		await Promise.allSettled(promiseList).then((res: any) => {
			const _arrInstock: any = [];
			res.forEach((item: any, index: any) => {
				if (item.status === 'fulfilled') {
					_arrInstock.push(variants[index].id);
				}
			});

			this.idVariantsInstock = [..._arrInstock];
		});
	}

	handleDataDefault(product: any) {
		const { options } = product || {};
		const defaultVariant = options.map((item: any) => item.values[0]);
		this.variantSelected = [...defaultVariant];
	}

	async getProductVariant(elemnt: any) {
		const { cartType } = this.selector;
		const elementsPopup = document.querySelector(this.selectorProductVariant);
		if (elementsPopup) return;

		const { handle, id } = elemnt.dataset || {};

		try {
			const services = new Services();
			const res: any = await services.getJSONProductByHandle(handle);

			if (res && res?.data) {
				const { product } = res?.data || {};
				const { options, variants } = product || {};

				if (variants && variants.length === 1) {
					const { id, option1 } = variants[0];

					if (option1 === 'Default Title') {
						this.addCart(id);
						return;
					}
				}

				this.handleDataDefault(product);

				await this.getInfoVariant(variants);
				this.currentProductVariant = { ...product };

				const htmlStringProductVariant: any = this.appearances.getHTMLProductVariant(options, cartType);
				const elmntVariantProduct: any = Utils.createElementFromHTML(htmlStringProductVariant);
				this.elemntWrapper.style.position = 'relative';

				this.elemntWrapper.appendChild(elmntVariantProduct);

				this.handleSetEventVariantPopup();
			}
		} catch (error: any) {
			const { status } = error.response || {};

			if (status === 404) {
				// this.addCart(id);
			}
		}
	}

	handleScrollTo(elmntList: any, currentElemnt: any) {
		const elmmnt = elmntList.querySelector(`li:nth-child(${currentElemnt})`);
		if (elmmnt) {
			elmmnt.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
		}
	}

	handleSetEventDrag() {
		const { recommend_products: recommendProducts } = this.settings;
		const { cartType } = this.selector;
		const slider = this.elemntWrapper.querySelector(this.selectorProductList);
		const btnPrev = this.elemntWrapper.querySelector(this.selectorBtnPrev);
		const btnNext = this.elemntWrapper.querySelector(this.selectorBtnNext);

		btnPrev.disabled = true;

		let currentElement = 1;
		const nextSlide = cartType === 'cartPage' ? 4 : 2;

		btnPrev.addEventListener('click', (e: any) => {
			e.preventDefault();
			currentElement -= nextSlide;
			const firstSlide = currentElement === 1;
			btnPrev.disabled = firstSlide;
			btnNext.disabled = false;
			this.handleScrollTo(slider, currentElement);
		});

		btnNext.addEventListener('click', (e: any) => {
			e.preventDefault();
			currentElement += nextSlide;
			const lastSlide = currentElement >= recommendProducts.length - nextSlide;
			btnPrev.disabled = false;
			btnNext.disabled = lastSlide;
			this.handleScrollTo(slider, currentElement);
		});
	}

	handleSetEventShowVariant() {
		try {
			const elements: any = this.elemntWrapper.querySelectorAll(this.selectorBtnShowVariant);

			for (let i = 0; i < elements.length; i++) {
				elements[i].addEventListener(
					'click',
					(e: any) => {
						e.preventDefault();
						this.getProductVariant(elements[i]);
					},
					false
				);
			}

			this.handleSetEventDrag();
		} catch (error) {
			console.error(error);
		}
	}

	handleSetEventVariantPopup() {
		try {
			this.handleCheckVariantInstock();
			// event click variant
			const elementsValue = this.elemntWrapper.querySelectorAll(this.selectorVariantValue);
			for (let i = 0; i < elementsValue.length; i++) {
				elementsValue[i].addEventListener(
					'click',
					() => this.handleChangeVariantValue(elementsValue[i]),
					false
				);
			}

			// event click btn add to cart
			const elements: any = this.elemntWrapper.querySelector(this.selectorBtnAddToCart);
			elements.addEventListener('click', () => this.handleAddToCart(), false);

			// event close popup
			const elementsPopupContent = this.elemntWrapper.querySelector(this.selectorProductVariantContent);
			const elementsPopup = this.elemntWrapper.querySelector(this.selectorProductVariant);

			window.addEventListener('click', function (e) {
				if (!elementsPopupContent.contains(e.target)) {
					if (elementsPopup) {
						elementsPopup.remove();
					}
				}
			});

			window.addEventListener('keyup', function (e) {
				if (e.key === 'Escape') {
					// escape key maps to keycode `27`
					if (elementsPopup) {
						elementsPopup.remove();
					}
				}
			});
		} catch (error) {
			console.error(error);
		}
	}

	handleChangeVariantValue(variantValue: any) {
		const { index, value } = variantValue.dataset || {};

		const arrClone = [...this.variantSelected];
		arrClone[index] = value;

		this.variantSelected = [...arrClone];

		// remove class active for siblings
		const elementsSiblings = document.querySelectorAll(
			`${this.selectorOptionItem}:nth-child(${Number(index) + 1}) ul li`
		);
		for (var i = 0; i < elementsSiblings.length; i++) {
			elementsSiblings[i].classList.remove('active');
		}

		// add class active for current
		variantValue.classList.add('active');
		this.handleCheckVariantInstock();
	}

	handleCheckVariantInstock() {
		const elements: any = document.querySelector(this.selectorBtnAddToCart);
		elements.classList.add('checking');

		const { variants } = this.currentProductVariant;
		const title = this.variantSelected.join(' / ');

		const variant = variants.find((item: any) => item.title === title) || {};

		if (variant?.id) {
			const isInstock = this.idVariantsInstock.includes(variant?.id);
			if (isInstock) {
				elements.classList.remove('checking');
			}
		}
	}

	handleAddToCart() {
		try {
			const { variants } = this.currentProductVariant;
			const title = this.variantSelected.join(' / ');

			const variant = variants.find((item: any) => item.title === title);

			if (variant) {
				this.addCart(variant.id);
			}
		} catch (error) {
			console.error(error);
		}
	}

	addCart(id: any) {
		if (id) {
			var form = document.createElement('form');
			var element1 = document.createElement('input');

			form.method = 'POST';
			form.action = '/cart/add';

			element1.name = 'id';
			element1.value = id;
			element1.type = 'hidden';

			form.appendChild(element1);

			document.body.appendChild(form);

			form.submit();
		}
	}
}

export default RecommendBySelector;
