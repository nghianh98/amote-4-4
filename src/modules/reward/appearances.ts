import configs from '_/helpers/configs';
import Utils from '_/helpers/utils';
import { REWARD_TYPES } from './constants';

class Appearances {
	private settings: any = configs.default.reward;
	private widgetClass = 'reward';

	load(settings: any) {
		this.settings = { ...settings };
	}

	private getTemplate(slot: string, cartType: string) {
		const {
			widgetClass,
			settings: {
				reward: { name: rewardName },
				template,
				transform
			}
		} = this;

		const htmlTemplate = `
			<div 
				class="amote-app" 
				widget="${widgetClass}"
				template="${template}"
				cart-type="${cartType}"
				transform="${transform}"
				reached="false"
			>
				${slot}
			</div>
		`;

		return htmlTemplate;
	}

	getStringHTMLProgressBar(cartType: string): string {
		const isComfortable = this.settings.template === 'comfortable';
		const prefixIcon = isComfortable ? 'green' : 'blue';
		const clsTextUnlock = `${this.widgetClass}__text-unlock`;
		const clsTextStatus = `${this.widgetClass}__text-status`;
		const clsProgress = `${this.widgetClass}__progress`;

		const htmlProgressBar = `
			<div class="${clsTextStatus}"></div>
			<div class="${clsProgress}">
				<img src="${configs.cdnUrl}/reward/${prefixIcon}-rocket-40x40.svg" />
				<div class="${clsProgress}__bar" style="${this.getStyleBarBG()}">
					<div class="${clsProgress}__bar__percent" style="${this.getStyleBarFG()}"></div>
					${this.getStringHTMLMileStones()}
					${this.getGiftBoxAnimation()}
				</div>
			</div>
			<div class="${clsTextUnlock}">
				${this.getTextUnlock()}
			</div>
		`;

		return this.getTemplate(htmlProgressBar, cartType);
	}

	getTextUnlock() {
		const milestones = this.settings.milestones;
		const rgba = this.settings.color.text_after;
		const hexColor = Utils.rgbToHex(rgba) || '';
		const isComfortable = this.settings.template === 'comfortable';

		let htmlTextUnlock = '';

		milestones.forEach((tier: any, index: number) => {
			const {
				reward: { name: rewardName },
				text_after_achieving
			} = tier;

			let tags: any = {
				reward_name: `<b>${Utils.convertLabelName(tier)}</b>`
			};

			let text = Utils.convertTextTagToHtml(text_after_achieving, tags);
			let icon = `
				<svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M14.2275 0.272519C14.402 0.447239 14.5 0.68408 14.5 0.931018C14.5 1.17796 14.402 1.4148 14.2275 1.58952L6.15155 9.66545C5.97683 9.83995 5.73999 9.93797 5.49305 9.93797C5.24611 9.93797 5.00927 9.83995 4.83455 9.66545L0.796583 5.62748C0.705031 5.54217 0.631599 5.4393 0.580669 5.32499C0.529738 5.21069 0.502353 5.0873 0.500145 4.96218C0.497937 4.83706 0.520953 4.71278 0.56782 4.59675C0.614686 4.48072 0.684443 4.37532 0.772929 4.28683C0.861415 4.19835 0.966817 4.12859 1.08285 4.08172C1.19888 4.03486 1.32316 4.01184 1.44828 4.01405C1.5734 4.01625 1.69679 4.04364 1.81109 4.09457C1.9254 4.1455 2.02827 4.21893 2.11358 4.31049L5.49305 7.68995L12.9105 0.272519C13.0852 0.0980162 13.322 0 13.569 0C13.8159 0 14.0528 0.0980162 14.2275 0.272519Z" fill="${hexColor}"/>
				</svg>
			`;

			if (isComfortable) {
				icon = `
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M1.62894 5.80968C1.78518 5.10446 2.0788 4.43693 2.49304 3.84519C2.90727 3.25346 3.43401 2.74912 4.04317 2.36096C4.65233 1.97281 5.33198 1.70844 6.04332 1.58297C6.75465 1.4575 7.48374 1.47337 8.18894 1.62968C8.38123 1.66797 8.58087 1.62943 8.7451 1.52233C8.90933 1.41522 9.02509 1.24807 9.06758 1.05666C9.11007 0.865249 9.07592 0.664811 8.97243 0.498276C8.86895 0.331741 8.70437 0.212351 8.51394 0.165678C7.16231 -0.133735 5.75225 -0.0256416 4.46205 0.476289C3.17186 0.978219 2.05946 1.85145 1.26552 2.98556C0.471584 4.11967 0.0317574 5.46373 0.00165556 6.84779C-0.0284462 8.23186 0.352528 9.59377 1.09641 10.7613C1.84029 11.9289 2.91367 12.8496 4.18082 13.4072C5.44798 13.9647 6.852 14.134 8.21537 13.8937C9.57873 13.6533 10.8402 13.0141 11.8403 12.0568C12.8404 11.0995 13.5342 9.86722 13.8339 8.51567C13.877 8.3214 13.8412 8.11797 13.7343 7.95012C13.6274 7.78228 13.4582 7.66377 13.2639 7.62068C13.0697 7.57758 12.8662 7.61342 12.6984 7.72031C12.5305 7.82721 12.412 7.9964 12.3689 8.19067C12.0533 9.61489 11.1849 10.8554 9.95464 11.6393C8.7244 12.4232 7.23315 12.6863 5.80894 12.3707C4.38473 12.0551 3.14422 11.1866 2.36032 9.95638C1.57642 8.72614 1.31333 7.23389 1.62894 5.80968Z" fill="${hexColor}"/>
						<path d="M13.0328 3.77985C13.1653 3.63767 13.2374 3.44962 13.2339 3.25532C13.2305 3.06102 13.1518 2.87564 13.0144 2.73822C12.877 2.60081 12.6916 2.5221 12.4973 2.51867C12.303 2.51524 12.1149 2.58737 11.9728 2.71985L7.00277 7.68984L4.78278 5.46985C4.6406 5.33737 4.45255 5.26524 4.25825 5.26867C4.06395 5.2721 3.87857 5.35081 3.74115 5.48822C3.60374 5.62564 3.52503 5.81102 3.5216 6.00532C3.51817 6.19962 3.5903 6.38767 3.72278 6.52984L6.47277 9.27984C6.6134 9.42029 6.80402 9.49918 7.00277 9.49918C7.20152 9.49918 7.39215 9.42029 7.53277 9.27984L13.0328 3.77985Z" fill="${hexColor}"/>
					</svg>
				`;
			}

			htmlTextUnlock += `
				<p tier="${index + 1}" reached="false" type="${rewardName}">
					${icon}
					<span style="color: ${hexColor};">${text}</span>
				</p>
			`;
		});

		return htmlTextUnlock;
	}

	getStringHTMLMileStones() {
		const { transform } = this.settings;
		const clsMileStones = `${this.widgetClass}__milestones`;
		const milestones: any = this.settings.milestones;
		// let maxValue = milestones[milestones.length - 1].minimum_amount;
		let htmlBody = '';

		milestones.forEach((item: any, index: number) => {
			const {
				reward: { name: rewardName }
			} = item;
			const leftPosition = (100 / milestones.length) * (index + 1);
			htmlBody += `<div 
							class="${clsMileStones}__tier" 
							tier-index="${index + 1}" 
							style="left: ${leftPosition}%; "
							type="${rewardName}"
						>
							<div class="${clsMileStones}__tier__gift" transform="${transform}">${this.getTier(milestones[index])}</div>
							${this.getTierTooltip(index)}
						</div>`;
		});

		return `<div class="${clsMileStones}">
					${htmlBody}
				</div>`;
	}

	getGiftBoxAnimation(): string {
		const { reached } = this.settings.animation;
		const clGift = `${this.widgetClass}__progress__bar__gift`;
		if (reached) {
			return `<div class="${clGift}">
						<img class="${clGift}__top" src="${configs.cdnUrl}/images/gift_top.svg" />
						<img class="${clGift}__body" src="${configs.cdnUrl}/images/gift_body.svg" />
						<img class="${clGift}__heart-red" src="${configs.cdnUrl}/images/gift_heart_red.svg" />
						<img class="${clGift}__heart-yellow" src="${configs.cdnUrl}/images/gift_heart_yellow.svg" />
					</div>`;
		}
		return '';
	}

	getTier(tier: any) {
		const clsMileStones = `${this.widgetClass}__milestones`;
		const clsTierGift = `${clsMileStones}__tier__gift`;

		try {
			const {
				reward: { name, free_gift }
			} = tier;
			const isComfortable = this.settings.template === 'comfortable';
			const prefixIcon = isComfortable ? 'green' : 'blue';
			let iconTier = '';

			if (name !== 'free_gift') {
				const iconName = this.getIconNameByRewardName(name);

				iconTier = `<img src="${configs.cdnUrl}/reward/${prefixIcon}-${iconName}.svg" />`;
			} else {
				if (free_gift) {
					const { image } = free_gift;
					const clProduct = `${clsTierGift}__product`;
					iconTier = `
						<div 
							class="${clProduct}"
							style="background-image: url(${image})"
						></div>
					`;
				}
			}

			return `
				<div class="transform-box">
					<img src="${configs.cdnUrl}/reward/${prefixIcon}-gift.svg" />
				</div>
				<div class="transform-gift">
					${iconTier}
				</div>
			`;
		} catch (error) {
			return '';
		}
	}

	getTierTooltip(indexTier: any) {
		const milestones: any = this.settings.milestones;
		const clsMileStones = `${this.widgetClass}__milestones`;
		const clsTier = `${clsMileStones}__tier`;

		try {
			const {
				reward: { free_gift }
			} = milestones[indexTier];
			let tooltipTier = '';

			if (free_gift) {
				const { image, title, price } = free_gift;
				const clProduct = `${clsTier}__product`;
				const clProductInfo = `${clProduct}__info`;

				tooltipTier = `
					<div class="${clProductInfo}" length="${milestones.length}" index="${indexTier + 1}">
						<div 
							class="${clProductInfo}__img"
							style="background-image: url(${image})"
						></div>
						<div class="${clProductInfo}__name">${title}</div>
						<div class="${clProductInfo}__price">
							<span>${Utils.formatCurrency(Utils.roundingPrice(price))}</span>
							<span>${Utils.formatCurrency(0)}</span>
						</div>
					</div>
				`;
			}

			return tooltipTier;
		} catch (error) {
			return '';
		}
	}

	getStyleBarBG() {
		const rgba = this.settings.color.background;
		return `background: ${rgba};`;
	}

	getStyleBarFG() {
		const rgba = this.settings.color.foreground;
		return `background: ${rgba};`;
	}

	getIconNameByRewardName(rewardName: string): string {
		let rs = '';
		switch (rewardName) {
			case 'free_shipping':
				rs = 'free';
				break;

			case 'discount':
				rs = 'coupon';
				break;

			default:
				break;
		}

		return rs;
	}
}

export default Appearances;
