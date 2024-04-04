import Services from '_/services';
import Appearances from './appearances';
import Utils from '_/helpers/utils';
import configs from '_/helpers/configs';
import RecommendBySelector from './recommend-by-selector';

class RecommendProdudct {
	private settings: any = {};
	private appearances: any = null;

	async render(): Promise<void> {
		await this.fetchData();

		if (!this.settings.is_active) return;

		const _appearances = new Appearances();
		_appearances.load(this.settings);
		this.appearances = _appearances;

		this.renderProductOnStore();
	}

	private async fetchData(): Promise<void> {
		try {
			const services = new Services();
			let data = await services.getRecommendProduct();

			if (data) {
				data = {
					...data,
					selectors: {
						cart_page: {
							wrapper: '',
							product_list: ''
						},
						cart_drawer: {
							wrapper: '',
							product_list: ''
						}
					}
					// style_css: ".amote-app[widget='recommend-product'][cart-type='cartDrawer'] { padding-top: 12px; }"
				};

				this.settings = {
					...data
				};

				// convert selector to snakeCake
				const _selectors: any = data?.selectors
					? { ...data?.selectors }
					: { ...configs.default.recommendation.selectors };
				const selectorConvert = Utils.convertSelectorFromDB({ ..._selectors });

				this.settings.selectors = {
					...selectorConvert
				};

				// random product
				const _recommendProduct: any = Utils.shuffleArray([...data?.recommend_products]);
				this.settings.recommend_products = [..._recommendProduct];

				this.handleStyleCss();
			}
		} catch (error) {
			console.error(error);
		}
	}

	handleStyleCss() {
		const { style_css }: any = this.settings;
		if (style_css) {
			Utils.addStylesCustom(style_css);
		}
	}

	renderProductOnStore() {
		const { selectors } = this.settings;
		for (let key in selectors) {
			selectors[key].cartType = key;
			const recommendBySelector = new RecommendBySelector();
			recommendBySelector.init(this.settings, selectors[key]);
		}
	}
}

export default RecommendProdudct;
