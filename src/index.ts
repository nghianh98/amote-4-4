import configs from '_/helpers/configs';
import AmoteStyles from '_/assets/styles/_amote.scss';
import Quotes from '_/modules/quotes';
import Reward from '_/modules/reward';
import ProductAppBlock from '_/modules/product-app-block';
import RecommendProdudct from '_/modules/recommend-product';
import Affiliate from '_/modules/affiliate';
import { THEME_ID_DEFAULT } from '_/modules/reward/constants';

declare global {
	interface Window {
		Amote: any;
	}
}

class Amote {
	private log() {
		console.log(configs.apps.logs.content, configs.apps.logs.style);
	}

	start() {
		// Log
		// this.runAffiliate();
		this.log();
		this.initStyles();
		this.addAttributesBody();

		// Quotes
		const quotes = new Quotes();
		quotes.render();

		// product app block
		const productAppBlock = new ProductAppBlock();
		productAppBlock.render();

		// Reward
		const reward = new Reward();
		reward.render();

		// RecommendProdudct
		const recommendProdudct = new RecommendProdudct();
		recommendProdudct.render();
	}

	initStyles(): void {
		const markupStyles: HTMLElement = document.createElement('div');
		markupStyles.id = 'amote-styled';
		document.body.append(markupStyles);
		AmoteStyles.use({ target: markupStyles });
	}

	addAttributesBody(): void {
		if (window.Shopify) {
			const {
				shop,
				theme: { name, theme_store_id }
			} = window.Shopify;
			if (name && theme_store_id) {
				document.body.setAttribute('amote-theme', name);
				document.body.setAttribute('amote-theme-id', theme_store_id);
			}

			if (shop) {
				document.body.setAttribute('amote-shop', shop);
			}
		} else {
			document.body.setAttribute('amote-theme-id', THEME_ID_DEFAULT.toString());
		}
	}

	runAffiliate() {
		const affiliate = new Affiliate();
		affiliate.init();
	}
}

const amote = new Amote();

if (!window.Amote) {
	amote.start();
	window.Amote = true;
}
