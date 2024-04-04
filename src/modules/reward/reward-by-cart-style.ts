import Utils from '_/helpers/utils';
import Services from '_/services';
import Appearances from './appearances';
import { TAGS, CART_ITEMS_DEFAULT, TEXT_DISCOUNT } from './constants';

class RewardByCartStyle {
	private settings: any = null;
	private appearances: any = null;
	private selector: any = null;

	private item_count: number = 0;
	private original_total_price: number = 0;
	private amount_left: number = 0;
	private percent: number = 0;
	private cartInfo: any = {};

	// selectors
	private selectorReward = ".amote-app[widget='reward']";
	private selectorTextUnlock = `${this.selectorReward} .reward__text-unlock`;
	private selectorTier = `${this.selectorReward} .reward__milestones__tier`;
	private selectorProgressBar = `${this.selectorReward} .reward__progress__bar`;
	private selectorTextStatus = `${this.selectorReward} .reward__text-status`;
	private tierMaxFreeGift: any = null;
	private selectorFormSubmit = "button[name='checkout']";
	private elmntFormSubmit: any = null;
	private eventFormSubmit = false;
	private addLabelFreeGift = false;
	private currentIndexTier = 0;
	private oldCurrentIndexTier = 0;
	private hasFullFGIncart = false;

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
		const { detectChange } = this.selector;

		this.handleRenderRewardBySelector();
		this.checkExistWrapper((elmntWrapper: any) => {
			const elmntReward = elmntWrapper.querySelector(this.selectorReward);
			if (elmntReward) {
				this.handleGetCartInfoToUpdateReward();
			}
		});
		this.handleDetectChange(detectChange);
	}

	handleMutation() {
		let interval: any = null;

		interval = setInterval(() => {
			const { wrapper } = this.selector;
			const elmntWrapper = document.querySelector(wrapper);

			if (elmntWrapper) {
				this.addLabelFreeGift = false;
				clearInterval(interval);
			}

			// case rerender all
			Utils.amoteMutationAllType(elmntWrapper, () => {
				const elmntReward = elmntWrapper.querySelector(this.selectorReward);
				if (!elmntReward) {
					this.handleRenderHTML();
				}
			});
		}, 500);
	}

	handleDetectChange(detectChange: any) {
		// case detect change when widget reward exist
		if (detectChange) {
			this.checkExistWrapper((elmntWrapper: any) => {
				const elmntDetectChange = document.querySelector(detectChange);
				Utils.amoteMutationAllType(elmntDetectChange, () => {
					const elmntReward = elmntWrapper.querySelector(this.selectorReward);
					if (elmntReward) {
						this.handleGetCartInfoToUpdateReward(detectChange);
					}
				});
			});
		}
	}

	handleRenderRewardBySelector() {
		this.hideRewardWhenEmptyCart();
		const { cartType, wrapper, progressBar } = this.selector;

		const elmntWrapper = document.querySelector(wrapper);

		if (elmntWrapper) {
			const elmntReward = elmntWrapper.querySelector(this.selectorReward);

			if (!elmntReward) {
				const elmntToInsertProgressBar = elmntWrapper.querySelector(progressBar);

				// progress bar
				if (elmntToInsertProgressBar) {
					const htmlProgressBar = this.appearances.getStringHTMLProgressBar(cartType);
					const elmntProgressbar = Utils.createElementFromHTML(htmlProgressBar);

					elmntToInsertProgressBar.before(elmntProgressbar);
				}

				const currentCombo = this.getCurrentCombo();
			}
		}
	}

	setPositionGiftBox() {
		const { notCalcPositionGift, cartType } = this.selector;

		this.checkExistWrapper((elmntWrapper: any) => {
			const elmntProgressBarElmt: any = elmntWrapper.querySelector(`.amote-app[widget="reward"]`);

			if (elmntProgressBarElmt) {
				const elmntPercentElmt: any = elmntProgressBarElmt.querySelector(`${this.selectorProgressBar}`);
				const elmntGiftElmt: any = elmntProgressBarElmt.querySelector(`${this.selectorProgressBar}__gift`);

				if (elmntPercentElmt) {
					const { left, top } = Utils.getOffset(elmntPercentElmt);

					if (elmntGiftElmt && left !== 0 && top !== 0) {
						let _top = top - window.scrollY;

						if (notCalcPositionGift && Utils.isStorefront()) {
							elmntProgressBarElmt.style.setProperty('--left-start-gift-box', `${0}px`);
							elmntProgressBarElmt.style.setProperty('--top-start-gift-box', `${_top}px`);
							elmntProgressBarElmt.style.setProperty('--left-end-gift-box', `${50}%`);
						} else {
							const widthBar = elmntPercentElmt.offsetWidth;
							const positionCenter = widthBar / 2;
							let leftStart = left;

							elmntProgressBarElmt.style.setProperty('--left-start-gift-box', `${leftStart}px`);
							elmntProgressBarElmt.style.setProperty('--top-start-gift-box', `${_top}px`);
							elmntProgressBarElmt.style.setProperty('--left-end-gift-box', `${left + positionCenter}px`);
						}
					}
				}
			}
		});
	}

	async handleGetCartInfoToUpdateReward(detectChange = false) {
		if (this.addLabelFreeGift && detectChange) {
			this.addLabelFreeGift = false;
			return;
		}

		if (!detectChange) {
			this.calcPercent();
			this.addAttributeLoading(true);
			this.handleUpdateReward();
		}

		try {
			let res: any = null;

			// call api cart
			if (!Utils.isStorefront()) {
				this.item_count++;
				res = await Utils.mockDataLocal(this.item_count);
			} else {
				// api on storefront

				const services = new Services();
				res = await services.getCart();
			}

			if (res && res.data) {
				// const dataCart = res.data;
				const { original_total_price, item_count } = res.data;
				this.original_total_price = original_total_price;
				this.item_count = item_count;
				this.cartInfo = res.data;
			}

			// calc percent
			this.hideRewardWhenEmptyCart();
			this.calcPercent();
			this.handleCheckFullFreeGift();
			this.addAttributeLoading(false);
			this.handleUpdateReward();
		} catch (error) {
			console.error(error);
		}
	}

	hideRewardWhenEmptyCart() {
		const { cartType } = this.selector;
		if (cartType === 'cartPage') {
			if (this.item_count === 0) {
				Utils.setAttributeBody(`amote-${cartType}-empty`, true);
			} else {
				Utils.setAttributeBody(`amote-${cartType}-empty`, false);
			}
		}
	}

	calcPercent() {
		this.setCurrentIndexTier();

		const { original_total_price } = this;

		let percent = 0;
		let subtotal = original_total_price;
		let currentMinimumAmount = this.getCurrentMinimumAmount();
		let lastMinimumAmount = this.getLastMinimumAmount();

		if (Utils.isStorefront()) {
			subtotal = original_total_price / 100;
			currentMinimumAmount = Utils.roundingPrice(currentMinimumAmount);
			lastMinimumAmount = Utils.roundingPrice(lastMinimumAmount);
		}

		this.amount_left = Number(currentMinimumAmount) - Number(subtotal);
		percent = (subtotal / lastMinimumAmount) * 100;

		this.percent = percent >= 100 ? 100 : percent;
	}

	handleCheckFullFreeGift() {
		if (!Utils.isStorefront()) return;
		const { items } = this.cartInfo;
		const { milestones } = this.settings;
		let idFreeGift: any = [];

		milestones.forEach((item: any) => {
			const {
				reward: { name, free_gift }
			} = item;
			if (free_gift) {
				const { product_id } = free_gift;
				idFreeGift.push(Number(product_id));
			}
		});

		let count = 0;
		let currentId = 0;

		if (items && items.length > 0) {
			items.forEach((item: any) => {
				const { id } = item;

				if (currentId !== id && idFreeGift.includes(id)) {
					count++;
				}
				currentId = id;
			});
		}

		this.hasFullFGIncart = count === 2;
	}

	setCurrentIndexTier() {
		const { original_total_price } = this;
		const { milestones } = this.settings;
		let totalPrice = original_total_price;
		let _currentIndexTier = 0;

		if (Utils.isStorefront()) {
			totalPrice = original_total_price / 100;
		}

		for (let index = 0; index < milestones.length; index++) {
			const current = milestones[index];
			const next = milestones[index + 1];

			if (current) {
				if (next) {
					if (
						totalPrice >= Utils.roundingPrice(current.minimum_amount) &&
						totalPrice < Utils.roundingPrice(next.minimum_amount)
					) {
						_currentIndexTier = index + 1;
						break;
					}
				} else {
					// last tier
					if (totalPrice >= Utils.roundingPrice(current.minimum_amount)) {
						_currentIndexTier = index + 1;
					}
				}
			}
		}

		this.oldCurrentIndexTier = this.currentIndexTier;
		this.currentIndexTier = _currentIndexTier;
	}

	getLastMinimumAmount() {
		const { milestones }: any = this.settings;
		const lastItem = milestones[milestones.length - 1];

		return lastItem.minimum_amount;
	}

	getCurrentMinimumAmount() {
		const { milestones }: any = this.settings;
		const currentTier = milestones[this.currentIndexTier];

		if (currentTier) {
			return currentTier.minimum_amount;
		} else {
			return this.getLastMinimumAmount();
		}
	}

	checkExistWrapper(cb: Function) {
		const { wrapper } = this.selector;
		const elmntWrapper = document.querySelector(wrapper);

		if (elmntWrapper) {
			cb(elmntWrapper);
		}
	}

	addAttributeLoading(status = false) {
		this.checkExistWrapper((elmntWrapper: any) => {
			const elmntRewards: any = elmntWrapper.querySelectorAll(`${this.selectorReward}`);
			if (elmntRewards && elmntRewards.length > 0) {
				elmntRewards.forEach((reward: any) => {
					reward.setAttribute('loading', status);
				});
			}
		});
	}

	handleUpdateReward() {
		this.updateProgressBar();
		this.updateAllText();
		// this.handleUpdateCart();
		this.handleFormSubmit();
	}

	getTextByCurrentIndexTier(index: number, isTextFreeGift = false) {
		const milestones = this.settings.milestones;
		const currentTier = milestones[index] || milestones[milestones.length - 1];

		const { original_total_price } = this;
		const formartLastMinimumAmount = Utils.roundingPrice(this.getLastMinimumAmount());

		if (currentTier) {
			const {
				minimum_amount,
				text_before_achieving,
				text_after_achieving,
				reward: { name: rewardName, discount: rewardDiscount }
			} = currentTier;

			let subtotal = original_total_price;
			let minimumAmount = minimum_amount;

			if (Utils.isStorefront()) {
				subtotal = original_total_price / 100;
				minimumAmount = Utils.roundingPrice(minimumAmount);
			}

			const amount_left = Number(minimumAmount) - Number(subtotal);

			// handle text before
			let tags: any = {
				amount_left: `<b>${Utils.formatCurrency(amount_left)}</b>`,
				reward_name: `<b>${Utils.convertLabelName(currentTier)}</b>`
			};

			// case discount
			if (rewardName === 'discount') {
				if (rewardDiscount) {
					const { value, type }: any = rewardDiscount;
					const valueRounding = Utils.roundingPrice(value);
					let discount = '';
					if (type === 'percentage') {
						discount = `<b>${value}%</b>`;
					} else if (type === 'fixedAmount') {
						discount = `<b>${Utils.formatCurrency(Number(valueRounding))}</b>`;
					}

					tags.discount = discount;
					tags.discount_rate = discount;
				}
			}

			let text = Utils.convertTextTagToHtml(text_before_achieving, tags);

			if (!isTextFreeGift) {
				if (subtotal >= formartLastMinimumAmount) {
					text = Utils.convertTextTagToHtml(text_after_achieving, tags);
				}
			} else {
				if (amount_left <= 0) {
					text = Utils.convertTextTagToHtml(text_after_achieving, tags);
					return { text, reached: true };
				}
			}

			return { text };
		}

		return { text: '' };
	}

	updateAllText() {
		try {
			// handle data
			const { currentIndexTier } = this;
			const milestones = this.settings.milestones;
			const currentTier = milestones[currentIndexTier] || milestones[milestones.length - 1];

			if (currentTier) {
				// handle text before
				let { text } = this.getTextByCurrentIndexTier(currentIndexTier);
				this.updateTextStatus(text);
			}
		} catch (error) {
			console.error(error);
		}
	}

	updateTextStatus(text: string) {
		const rgba = this.settings.color.text_before;
		const hexColor = Utils.rgbToHex(rgba) || '';
		this.checkExistWrapper((elmntWrapper: any) => {
			const barTextElmts: any = elmntWrapper.querySelectorAll(this.selectorTextStatus);

			if (barTextElmts) {
				barTextElmts.forEach((barTextElmt: any) => {
					barTextElmt.style.opacity = 0.7;
					barTextElmt.innerHTML = `<span style="color: ${hexColor};">${text}</span>`;
					setTimeout(() => {
						barTextElmt.style.opacity = 1;
					}, 500);
				});
			}
		});
	}

	updateProgressBar() {
		this.checkExistWrapper((elmntWrapper: any) => {
			const elmntReward: any = elmntWrapper.querySelector(`${this.selectorReward}`);

			if (elmntReward) {
				elmntReward.setAttribute('reached', this.percent === 100);
			}

			this.calcWidthForeground();
			this.updateReachedForTier();
		});
	}

	calcWidthForeground() {
		this.checkExistWrapper((elmntWrapper: any) => {
			const {
				selectorProgressBar,
				selectorTier,
				original_total_price,
				settings: { milestones }
			} = this;

			const price = original_total_price / 100;

			const maxPercent = 100 / milestones.length;
			const arrIndexTier = Array.from(Array(milestones.length).keys());
			const widthProgressBar = elmntWrapper.querySelector(selectorProgressBar).offsetWidth;
			const widthTier1 = 50;
			let percent = 0;

			arrIndexTier.forEach((indexTier) => {
				const currentTier = milestones[indexTier];
				const currentTierValue = Utils.roundingPrice(currentTier.minimum_amount);

				if (indexTier <= 0) {
					const range = currentTierValue;
					percent = (price / range) * maxPercent;
				} else {
					const maxPercentPrev = maxPercent * indexTier;
					const valuePrev = Utils.roundingPrice(milestones[indexTier - 1]?.minimum_amount || 0);
					const range = currentTierValue - valuePrev;
					const priceRange = price - valuePrev;
					percent = (priceRange / range) * maxPercent + maxPercentPrev;
				}
			});

			let spaceGift = ((widthTier1 / widthProgressBar) * 100) / 2 + 2;
			spaceGift = isFinite(spaceGift) ? spaceGift : 0;

			milestones.forEach((item: any, index: number) => {
				const tier = index + 1;
				const spaceBF = maxPercent * tier - spaceGift;
				const spaceAT = maxPercent * tier + spaceGift;

				if (percent > spaceBF && percent < maxPercent * tier) {
					percent = spaceBF;
				}

				if (tier !== milestones.length) {
					if (percent > maxPercent * tier && percent < spaceAT) {
						percent = spaceAT;
					}
				}
			});

			const percentElmnt = elmntWrapper.querySelector(`${selectorProgressBar}__percent`);

			if (percentElmnt) {
				percent = isFinite(percent) ? percent : 0;
				percentElmnt.style.width = (percent || 0) + '%';
			}
		});
	}

	calcPercentPerTier(index: number) {
		const { milestones } = this.settings;
		const { original_total_price } = this;
		let { minimum_amount } = milestones[index];
		let percentTier = 0;
		let subtotal = original_total_price;
		let minimumAmountTierPrev = this.getMinimumAmountTierPrevious(index);

		if (Utils.isStorefront()) {
			subtotal = original_total_price / 100;
			minimumAmountTierPrev = Utils.roundingPrice(minimumAmountTierPrev);
			minimum_amount = Utils.roundingPrice(minimum_amount);
		}

		percentTier = ((subtotal - minimumAmountTierPrev) / (minimum_amount - minimumAmountTierPrev)) * 100;
		percentTier = percentTier > 0 ? percentTier : 0;

		return percentTier >= 100 ? 100 : percentTier;
	}

	getMinimumAmountTierPrevious(indexTier: number) {
		const { milestones } = this.settings;

		const tierPrev = milestones[indexTier - 1];

		return tierPrev?.minimum_amount || 0;
	}

	updateReachedForTier() {
		this.checkExistWrapper((elmntWrapper: any) => {
			const { milestones } = this.settings;

			elmntWrapper.querySelectorAll(`${this.selectorTier}`).forEach((elmnt: any, index: number) => {
				const oldReached = milestones[index].reached;

				const price = this.original_total_price / 100;
				const minimumAmount = Utils.roundingPrice(milestones[index].minimum_amount);
				const isReached = price >= minimumAmount;

				const isAnimation = oldReached != isReached;

				this.settings.milestones[index].reached = isReached;

				elmnt.setAttribute('reached', isReached);
				elmnt.setAttribute('animation', isAnimation);
			});
			this.updateTextBefore(elmntWrapper);
			this.updateTextUnlock(elmntWrapper);
			this.handleGiftAnimation(elmntWrapper);
			this.getTierMaxFreeGift();
		});
	}

	updateTextBefore(elmntWrapper: any) {
		for (let i = 1; i <= this.currentIndexTier; i++) {
			const elmntTierReached: any = elmntWrapper.querySelector(`${this.selectorTier}[tier-index="${i}"]`);
			// reached per tier on progress bar
			if (elmntTierReached) {
				elmntTierReached.setAttribute('reached', true);
			}
		}
	}

	updateTextUnlock(elmntWrapper: any) {
		const { milestones } = this.settings;
		// text before
		elmntWrapper.querySelectorAll(`${this.selectorTextUnlock} p`).forEach((elmnt: any) => {
			if (elmnt) {
				elmnt.setAttribute('reached', false);
			}
		});

		let lastTierFGReached = null;

		for (let i = 1; i <= this.currentIndexTier; i++) {
			const tier = milestones[i - 1];
			const {
				reward: { name: rewardName }
			} = tier;
			if (rewardName !== 'free_gift') {
				const elmntTextUnlockReached: any = elmntWrapper.querySelector(
					`${this.selectorTextUnlock} p[tier="${i}"]`
				);

				if (elmntTextUnlockReached) {
					elmntTextUnlockReached.setAttribute('reached', true);
				}
			} else {
				lastTierFGReached = i;
			}
		}

		const elmntTextUnlockLastFGReached: any = elmntWrapper.querySelector(
			`${this.selectorTextUnlock} p[tier="${lastTierFGReached}"]`
		);

		if (elmntTextUnlockLastFGReached) {
			elmntTextUnlockLastFGReached.setAttribute('reached', true);
		}
	}

	handleGiftAnimation(elmntWrapper: any) {
		// handle Gift animation when reached per Tier
		this.setPositionGiftBox();

		const elmntProgresBar: any = elmntWrapper.querySelector(`${this.selectorReward}`);

		if (elmntProgresBar) {
			const isIndexDifferent = this.oldCurrentIndexTier !== this.currentIndexTier;
			const isNewIsGreaterThanOld = this.currentIndexTier > this.oldCurrentIndexTier;

			if (isIndexDifferent && isNewIsGreaterThanOld) {
				elmntProgresBar.setAttribute('reached-tier', true);
			} else {
				this.resetAnimation();
				elmntProgresBar.setAttribute('reached-tier', false);
			}
		}
	}

	updateReachedForTier2() {
		this.checkExistWrapper((elmntWrapper: any) => {
			const { milestones } = this.settings;

			// reset reached
			elmntWrapper.querySelectorAll(`${this.selectorTier}`).forEach((elmnt: any) => {
				if (elmnt) {
					elmnt.setAttribute('reached', false);
				}
			});

			elmntWrapper.querySelectorAll(`${this.selectorTextUnlock} p`).forEach((elmnt: any) => {
				if (elmnt) {
					elmnt.setAttribute('reached', false);
				}
			});

			for (let i = 1; i <= this.currentIndexTier; i++) {
				const elmntTierReached: any = elmntWrapper.querySelector(`${this.selectorTier}[tier-index="${i}"]`);
				const elmntTextUnlockReached: any = elmntWrapper.querySelector(
					`${this.selectorTextUnlock} p[tier="${i}"]`
				);

				// reached per tier on progress bar
				if (elmntTierReached) {
					elmntTierReached.setAttribute('reached', true);
				}

				if (elmntTextUnlockReached) {
					elmntTextUnlockReached.setAttribute('reached', true);
				}
			}
			// handle Gift animation when reached per Tier
			this.setPositionGiftBox();

			const elmntProgresBar: any = elmntWrapper.querySelector(`${this.selectorReward}`);

			if (elmntProgresBar) {
				const isIndexDifferent = this.oldCurrentIndexTier !== this.currentIndexTier;
				const isNewIsGreaterThanOld = this.currentIndexTier > this.oldCurrentIndexTier;

				if (isIndexDifferent && isNewIsGreaterThanOld) {
					elmntProgresBar.setAttribute('reached-tier', true);
				} else {
					this.resetAnimation();
					elmntProgresBar.setAttribute('reached-tier', false);
				}
			}
		});
	}

	resetAnimation() {
		this.checkExistWrapper((elmntWrapper: any) => {
			const elmntProgresBar: any = elmntWrapper.querySelector(`${this.selectorReward} .reward__progress__bar`);
			if (elmntProgresBar) {
				const giftBoxElmt: any = elmntProgresBar.querySelector(`${this.selectorProgressBar}__gift`);
				const giftTopElmt: any = elmntProgresBar.querySelector(`${this.selectorProgressBar}__gift__top`);
				const giftHeartRedElmt: any = elmntProgresBar.querySelector(
					`${this.selectorProgressBar}__gift__heart-red`
				);
				const giftHeartYellowElmt: any = elmntProgresBar.querySelector(
					`${this.selectorProgressBar}__gift__heart-yellow`
				);

				const listAnimation = [giftBoxElmt, giftTopElmt, giftHeartRedElmt, giftHeartYellowElmt];
				listAnimation.forEach((elemnt) => {
					if (elemnt) {
						elemnt.style.animation = 'none';
						elemnt.offsetHeight; /* trigger reflow */
						elemnt.style.animation = null;
					}
				});
			}
		});
	}

	private handleFormSubmit() {
		this.checkExistWrapper((elmntWrapper: any) => {
			const { formSubmit = this.selectorFormSubmit, isDetectMousedown } = this.selector;

			if (!elmntWrapper.contains(this.elmntFormSubmit)) {
				this.eventFormSubmit = false;
				this.elmntFormSubmit = elmntWrapper.querySelector(formSubmit);
			}

			if (this.elmntFormSubmit && !this.eventFormSubmit) {
				this.eventFormSubmit = true;
				let flag = false;

				const eventName = isDetectMousedown ? 'mousedown' : 'click';

				this.elmntFormSubmit.removeEventListener(eventName, () => {});
				this.elmntFormSubmit.addEventListener(eventName, async (event: any) => {
					if (flag) {
						flag = false;
						return;
					}

					event.preventDefault();
					event.stopPropagation();

					this.handleAddCodeAndGift();

					flag = true;

					setTimeout(() => {
						this.elmntFormSubmit.click();
					}, 500);
				});
			}
		});
	}

	private handleAddCodeAndGift() {
		// code free_shipping
		// this.handleAddCodeFreeShipping();

		// free_gift
		this.handleAddGift();
	}

	private handleAddGift() {
		try {
			this.checkExistWrapper((elmntWrapper: any) => {
				const elmntTextUnlockLastFGReached: any = elmntWrapper.querySelector(
					`${this.selectorTextUnlock} p[reached="true"][type="free_gift"]`
				);

				if (elmntTextUnlockLastFGReached) {
					const indexTier = elmntTextUnlockLastFGReached.getAttribute('tier');

					if (indexTier) {
						const { milestones } = this.settings;
						const productId = milestones[Number(indexTier) - 1].reward.free_gift.product_id;

						if (productId) {
							const { items } = this.cartInfo;
							if (items) {
								const index = items.findIndex(
									(item: any) => item?.id == productId && item?.discounted_price === 0
								);

								if (index === -1) {
									this.addCart(productId);
								}
							}
						}
					}
				}
			});
		} catch (error) {
			console.log(error);
		}
	}

	getTierMaxFreeGift() {
		try {
			const { milestones } = this.settings;
			let lastTierFreeGiftReached = 0;
			milestones.forEach((item: any, index: number) => {
				const {
					reward: { name }
				} = item;
				if (name === 'free_gift') {
					if (index + 1 <= this.currentIndexTier) {
						lastTierFreeGiftReached = index + 1;
					}
				}
			});

			if (lastTierFreeGiftReached) {
				this.checkExistWrapper((elmntWrapper: any) => {
					const elmntItemsFreeGift: any = elmntWrapper.querySelectorAll(`${this.selectorTier}`);
					if (elmntItemsFreeGift) {
						elmntItemsFreeGift.forEach((item: any, index: number) => {
							const type = item.getAttribute('type');
							const tier = item.getAttribute('tier-index');
							if (type === 'free_gift') {
								item.setAttribute('last-tier-reached', tier == lastTierFreeGiftReached);
							}
						});
					}
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	addCart(product_id: any) {
		const services = new Services();
		const data = {
			items: [
				{
					id: product_id,
					quantity: 1
				}
			]
		};

		return services.addCart(data);
	}

	updateCart(product_id: any) {
		const services = new Services();
		let updates: any = {};
		updates[product_id] = 0;
		return services.updateCart({ updates });
	}

	async handleUpdateCart() {
		const milestone = this.settings.milestones[0];
		const {
			reward: { name: rewardName, free_gift }
		} = milestone;
		if (rewardName !== 'free_gift') return;

		if (free_gift) {
			this.checkExistWrapper((elmntWrapper: any) => {
				const { cartItems = CART_ITEMS_DEFAULT } = this.selector;
				const elmntCartItemsWrapper = elmntWrapper.querySelector(cartItems.wrapper);
				const textGiftElmts: any = elmntWrapper.querySelector(
					`${this.selectorReward}[reward-type="free-gift"]`
				);
				if (elmntCartItemsWrapper && textGiftElmts) {
					const { items } = this.cartInfo;

					if (items) {
						const { product_id }: any = free_gift;
						const index = items.findIndex((item: any) => item?.id == product_id && item?.final_price === 0);

						if (index !== -1) {
							const elmntItemFreeGift = elmntCartItemsWrapper.querySelector(
								`${cartItems.item}:nth-child(${index + 1})`
							);

							if (elmntItemFreeGift) {
								this.addLabelFree(elmntItemFreeGift);
								textGiftElmts.style.display = 'none';
							}
						} else {
							textGiftElmts.style.display = 'block';
						}
					}
				}
			});
		}
	}

	addLabelFree(elmntItemFreeGift: any) {
		this.addLabelFreeGift = true;
		elmntItemFreeGift.style.backgroundColor = '#fffae5';
		elmntItemFreeGift.style.position = 'relative';

		const elmntLabelFree = Utils.createElementFromHTML('<div class="amote-label-free">Free</div>');
		elmntItemFreeGift.appendChild(elmntLabelFree);
	}

	getCurrentCombo() {
		const { milestones }: any = this.settings;
		const rewardNames = milestones.map((tier: any) => tier.reward.name);

		if (rewardNames.includes('discount')) return 'discount';
		if (rewardNames.includes('free_gift')) return 'free_gift';
		return 'free_shipping';
	}
}

export default RewardByCartStyle;
