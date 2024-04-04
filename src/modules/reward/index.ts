import configs from '_/helpers/configs';
import Utils from '_/helpers/utils';
import Services from '_/services';
import Appearances from './appearances';
import RewardByCartStyle from './reward-by-cart-style';
import { SHOP_ADD_CODE_REACHED } from './constants';

class Reward {
	private settings = configs.default.reward;
	private selectors: any = {};
	private appearances: any = null;
	private item_count = 1;
	private isFGOutOfStock = false;

	async render(): Promise<void> {
		await this.fetchData();
		const _appearances = new Appearances();
		_appearances.load(this.settings);
		this.appearances = _appearances;

		if (!this.settings.is_active || this.isFGOutOfStock) return;

		if (!Utils.isStorefront()) {
			this.loadRewardOnLocal();
		} else {
			this.loadRewardOnStoreFront();
		}
	}

	// === start handle Data
	private async fetchData(): Promise<void> {
		const services = new Services();
		try {
			const data: any = await services.getReward();
			if (data) {
				this.mergeData(data);
			}
		} catch (error) {
			console.error(error);
		}

		// this.settings.is_active = true;
		// this.settings.transform = "transform1";
		// this.settings.template = "comfortable";
		// this.settings.milestones = this.settings.milestones.splice(1, 2);

		if (!this.settings.is_active) return;

		const _selectors: any = this.settings.selectors;
		this.settings.selectors = Utils.convertSelectorFromDB({ ..._selectors });

		Utils.setAttributeBody('amote-reward', true);

		this.handleStyleCss();

		// handle Data Selector
		this.handleDataSelector();

		// format milestones
		this.formatDataMilestones();

		// check shop add code when reached
		this.checkShopAddCode();

		await this.handleFreeGiftOutOfStock();
	}

	handleStyleCss() {
		const { styleCss }: any = this.settings;

		if (styleCss) {
			Utils.addStylesCustom(styleCss);
		}
	}

	private mergeData(settings: any): void {
		if (Utils.isObjectEmpty(settings.animation)) {
			delete settings.animation;
		}

		this.settings = { ...this.settings, ...settings };
	}

	private handleDataSelector() {
		// get selectors by theme
		let selectorsByTheme = Utils.getRewardSelector();
		const {
			cartStyle: { page, drawer }
		} = this.settings;
		const settings: any = this.settings;

		if (settings.selectors) {
			selectorsByTheme = { ...settings.selectors };
		}

		for (let key in selectorsByTheme) {
			selectorsByTheme[key]['cartType'] = key;
		}

		this.selectors = selectorsByTheme;
	}

	private formatDataMilestones() {
		try {
			const settings: any = this.settings;

			// mix old data to tier1
			const {
				free_shipping_discount_code,
				setting: {
					condition: { value: minimum_amount }
				},
				reward: { name: rewardName, value, product },
				text_before_achieving,
				text_after_achieving,
				reward_label,
				milestones
			} = settings;

			let tier1: any = {
				free_shipping_discount_code,
				minimum_amount,
				text_before_achieving,
				text_after_achieving,
				label: reward_label,
				reward: {
					name: rewardName
				}
			};

			if (rewardName === 'discount') {
				tier1.reward.discount = value;
			}

			if (rewardName === 'free_gift') {
				tier1.reward.free_gift = product;
			}

			// add tier1 to milestones
			milestones.unshift(tier1);

			milestones.map((item: any) => {
				item.reached = false;
				return item;
			});

			this.settings.milestones = milestones;

			this.settings = { ...settings };
		} catch (error) {
			console.error(error);
		}
	}

	private checkShopAddCode() {
		if (window.Shopify) {
			const shop = window.Shopify.shop;
			this.settings.isShopAddCodeWhenReached = SHOP_ADD_CODE_REACHED.includes(shop);
		}
	}

	private async handleFreeGiftOutOfStock() {
		try {
			const { milestones } = this.settings;
			const tierFGs = milestones.filter((item: any) => item.reward.name === 'free_gift');

			if (tierFGs.length > 0) {
				const listProductID = tierFGs.map((item: any) => item.reward.free_gift.product_id);

				if (listProductID.length > 0) {
					const services = new Services();

					await Promise.all(listProductID.map((id) => services.getProduct(id)))
						.then((res: any) => {
							if (res.length > 0) {
								const _milestones = [...milestones];
								res.forEach((product: any, index: number) => {
									const productId = listProductID[index];
									const { variants, image, title: titleProduct } = product;
									const variant = variants.find((variant: any) => variant.id == productId);

									if (variant) {
										_milestones.map((tier: any) => {
											if (tier.reward.name === 'free_gift') {
												if (tier.reward.free_gift.product_id == productId) {
													const newData = {
														title:
															variants.length > 1
																? `${titleProduct} ${variant.title}`
																: product.title,
														price: Number(variant.price),
														image: image.src
													};

													tier.reward.free_gift = {
														...tier.reward.free_gift,
														...newData
													};
												}
											}
											return tier;
										});
									}
								});

								this.settings.milestones = _milestones;
							}
						})
						.catch((err) => {
							this.isFGOutOfStock = true;
						});
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	// === end handle Data

	// === start Local
	loadRewardOnLocal() {
		let intervalLocal: any = null;

		intervalLocal = setInterval(() => {
			const elmntQuote = document.querySelector('.amote-app.is-local[widget="quote"]');
			if (elmntQuote) {
				clearInterval(intervalLocal);
				const htmlRewardLocal = this.appearances.getHtmlLocal();

				setTimeout(() => {
					document.body.innerHTML += htmlRewardLocal;
					this.handleAppendHtmlCartLocal();
				}, 1000);

				// render reward by cart style
				const { selectors } = this;
				for (let key in selectors) {
					const rewardByCartStyle = new RewardByCartStyle();
					rewardByCartStyle.init(this.settings, selectors[key]);
				}
			}
		}, 100);
	}

	handleAppendHtmlCartLocal(cartStyles = ['cartPage', 'cartDrawer']) {
		const elmntCartDrawer: any = document.querySelector('.reward-local #CartDrawer');
		const elmntCartItems: any = document.querySelector('.reward-local cart-items');

		const htmlCartDrawerWrapper = this.appearances.getHtmlLocalCartDrawerWrapper();
		const htmlCartPageWrapper = this.appearances.getHtmlLocalCartPageWrapper();

		cartStyles.forEach((cartStyle: any) => {
			setTimeout(() => {
				if (elmntCartItems && cartStyle === 'cartPage') {
					elmntCartItems.innerHTML += htmlCartPageWrapper;
					this.handleActionLocal(elmntCartItems);
				}

				if (elmntCartDrawer && cartStyle === 'cartDrawer') {
					elmntCartDrawer.innerHTML += htmlCartDrawerWrapper;
					this.handleActionLocal(elmntCartDrawer);
				}
			}, 100);
		});
	}

	handleActionLocal(wrapper: any) {
		const cartStyles = ['cartPage', 'cartDrawer'];

		cartStyles.forEach((style: string) => {
			const btnChange = wrapper.querySelectorAll(`button.${style}`);

			btnChange.forEach((btn: any) => {
				btn?.addEventListener('click', () => {
					const type = btn.getAttribute('type');
					this.handleDataBeforeUpdateRewardLocal(style, type || '');
				});
			});
		});
	}

	handleDataBeforeUpdateRewardLocal(cartStyle: string, type: string) {
		if (type === 'remove') {
			this.item_count--;
		} else {
			this.item_count++;
		}

		if (cartStyle === 'cartPage') {
			const elmntLocalCartCountBubble: any = document.querySelector('#cart-icon-bubble .cart-count-bubble');

			if (elmntLocalCartCountBubble) {
				elmntLocalCartCountBubble.innerHTML = this.item_count;
			}
		} else {
			this.handleTestCaseRemoveElementLocal();
		}
	}

	handleTestCaseRemoveElementLocal() {
		const elmntCartDrawerWrapper: any = document.querySelector('.CartDrawer-wrapper');

		if (elmntCartDrawerWrapper) {
			elmntCartDrawerWrapper.remove();
		}

		this.handleAppendHtmlCartLocal(['cartDrawer']);
	}
	// === end Local

	// start on storeFront
	loadRewardOnStoreFront() {
		// render reward by cart style
		const { selectors } = this;
		for (let key in selectors) {
			const rewardByCartStyle = new RewardByCartStyle();
			rewardByCartStyle.init(this.settings, selectors[key]);
		}
	}
}

export default Reward;
