import Utils from '_/helpers/utils';

const ICON_ADD_CART = `
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
		<g clipPath="url(#clip0_64041_3222)">
			<path
			d="M9.60078 0.8C9.60078 0.358172 9.24261 0 8.80078 0C8.35895 0 8.00078 0.358172 8.00078 0.8V3.66863L6.96647 2.63431C6.65405 2.3219 6.14752 2.3219 5.8351 2.63431C5.52268 2.94673 5.52268 3.45327 5.8351 3.76569L8.2351 6.16569C8.54751 6.47811 9.05405 6.47811 9.36647 6.16569L11.7665 3.76569C12.0789 3.45327 12.0789 2.94673 11.7665 2.63431C11.454 2.3219 10.9475 2.3219 10.6351 2.63431L9.60078 3.66863V0.8Z"
			fill="#333333"
			/>
			<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M0.800781 0.8C0.800781 0.358172 1.15895 0 1.60078 0H2.80078C3.46352 0 4.00078 0.537258 4.00078 1.2V8H12.9069L13.6088 3.08686C13.6713 2.64948 14.0765 2.34556 14.5139 2.40804C14.9513 2.47052 15.2552 2.87575 15.1927 3.31314L14.4418 8.56971C14.3573 9.16088 13.851 9.6 13.2539 9.6H4.00078V11.2H12.0008C13.3263 11.2 14.4008 12.2745 14.4008 13.6C14.4008 14.9255 13.3263 16 12.0008 16C10.6753 16 9.60078 14.9255 9.60078 13.6C9.60078 13.3195 9.6489 13.0502 9.73735 12.8H5.46422C5.55266 13.0502 5.60078 13.3195 5.60078 13.6C5.60078 14.9255 4.52626 16 3.20078 16C1.8753 16 0.800781 14.9255 0.800781 13.6C0.800781 12.555 1.46863 11.666 2.40078 11.3366V1.6H1.60078C1.15895 1.6 0.800781 1.24183 0.800781 0.8ZM11.2008 13.6C11.2008 13.1582 11.559 12.8 12.0008 12.8C12.4426 12.8 12.8008 13.1582 12.8008 13.6C12.8008 14.0418 12.4426 14.4 12.0008 14.4C11.559 14.4 11.2008 14.0418 11.2008 13.6ZM2.40078 13.6C2.40078 13.1582 2.75895 12.8 3.20078 12.8C3.64261 12.8 4.00078 13.1582 4.00078 13.6C4.00078 14.0418 3.64261 14.4 3.20078 14.4C2.75895 14.4 2.40078 14.0418 2.40078 13.6Z"
			fill="#333333"
			/>
		</g>
		<defs>
			<clipPath id="clip0_64041_3222">
			<rect width="16" height="16" fill="white" />
			</clipPath>
		</defs>
	</svg>
`;

const ICON_ARROW = `
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
		<path fill-rule="evenodd" clip-rule="evenodd" d="M15.2146 9.2434L8.81827 2.84709L10.586 1.07932L20 10.4933L19.9997 10.4935L20 10.4938L10.573 19.9207L8.80528 18.1529L15.2148 11.7434L-3.57442e-07 11.7434L-4.6672e-07 9.2434L15.2146 9.2434Z" fill="#747474"/>
	</svg>
`;

class Appearances {
	private widgetClass = 'recommend-product';
	private widgetVariantClass = 'product-variant';
	private settings: any = {};

	load(settingsProp: any) {
		this.settings = { ...settingsProp };
	}

	private getTemplate(slot: string, cartType: any) {
		const htmlTemplate = `
			<div 
				class="amote-app" 
				widget="${this.widgetClass}"
				cart-type="${cartType}"
			>
				${slot}
			</div>
		`;

		return htmlTemplate;
	}

	private getTemplateVariant(slot: string, cartType: any) {
		const htmlTemplate = `
			<div class="amote-app" widget="${this.widgetVariantClass}" cart-type="${cartType}">
				<div class="${this.widgetVariantClass}__backdrop"></div>
				<div class="${this.widgetVariantClass}__content">
					${slot}
				</div>
			</div>
		`;

		return htmlTemplate;
	}

	private getHTMLRecommnedProduct(cartType: any) {
		const { title, call_to_action: callToAction, recommend_products: recommendProducts } = this.settings;

		const htmlTitle = title ? `<div class="RecommendProduct__title">${title}</div>` : '';

		let htmlProductItem = '';

		recommendProducts.forEach((product: any) => {
			const { id, title, images, variants, handle } = product;
			const { price } = variants[0];
			const productImage = Utils.getProductImage(images);

			htmlProductItem += `
				<li key=${id} class="RecommendProduct__item">
					<div class="RecommendProduct__item__wrapper">
						<div
							class="RecommendProduct__item__img"
							style="background-image: url(${productImage})"
						></div>
						<div class="RecommendProduct__item__infor">
							<div class="RecommendProduct__item__infor__name">${title}</div>
							<div class="RecommendProduct__item__infor__price">${Utils.formatCurrency(price)}</div>
						</div>

						<div class="RecommendProduct__item__actions">
							<button data-handle="${handle}" data-id="${id}">
								${ICON_ADD_CART}
								<span>${callToAction}</span>
							</button>
						</div>
					</div>
				</li>
			`;
		});

		const htmlBtnPrev =
			recommendProducts.length > 2 ? `<button class="RecommendProduct__btnPrev">${ICON_ARROW}</button>` : '';

		const htmlBtnNext =
			recommendProducts.length > 2 ? `<button class="RecommendProduct__btnNext">${ICON_ARROW}</button>` : '';

		const htmlList = `
			<div class="RecommendProduct">
				${htmlTitle}
				<div class="RecommendProduct__scroll">
					${htmlBtnPrev}
					<ul class="RecommendProduct__list">
						${htmlProductItem}
					</ul>
					${htmlBtnNext}
				</div>
			</div>
		`;

		return this.getTemplate(htmlList, cartType);
	}

	private getHTMLProductVariant(options: any, cartType: any) {
		const { call_to_action: callToAction } = this.settings;
		let htmlOptionsItem = '';

		options.forEach((option: any, indexOption: any) => {
			const { name, values } = option;

			let htmlValuesItem = '';

			values.forEach((value: any, index: any) => {
				const firstValue = index === 0 && 'active';

				htmlValuesItem += `
					<li class="RecommendProduct__values__item ${firstValue}" data-index="${indexOption}" data-value="${value}">
						<span>${value}</span>
					</li>
				`;
			});

			htmlOptionsItem += `
				<li class="RecommendProduct__options__item">
					<h5>${name}</h5>
					<div class="RecommendProduct__values">
						<ul class="RecommendProduct__values__list">
							${htmlValuesItem}
						</ul>
					</div>
				</li>
			`;
		});

		const htmlList = `
			<div class="RecommendProduct__options">
				<ul class="RecommendProduct__options__list">
					${htmlOptionsItem}
				</ul>
				<button>
					${ICON_ADD_CART}
					<span>${callToAction}</span>
				</button>
			</div>
		`;

		return this.getTemplateVariant(htmlList, cartType);
	}
}

export default Appearances;
