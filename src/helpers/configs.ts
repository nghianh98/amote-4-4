const packageInfo = require('../../package.json');
const version = packageInfo.version;
const cdnUrl = 'https://cdn.amote.app/assets';

const configs = {
	apps: {
		logs: {
			content: `%cAMOTE - ${version}`,
			style: 'font-weight:600;font-size:12px;padding:0.125rem 0.375rem 0.125rem 0.375rem;border-radius:0.25rem;color:#484848;background:linear-gradient(155deg, #FFFFC7 12.37%, #FF9E54 87.63%);'
		}
	},
	cdnUrl,
	default: {
		quote: {
			is_active: false,
			content: "I love shopping for things online because when they arrive it's like a present to me, from me",
			author: 'Hallie Abrams',
			template: 'sharpLight',
			position: 'aboveCheckoutButton',
			page: 'cart',
			selectors: [
				"button[name='checkout']",
				"input[name='checkout']",
				"a[href='/checkout']",
				"button[name='icartCheckout']",
				'#cart-modal-form-footer form div:first-of-type',
				'.so-proceed-checkout-btn',
				'.fcsb-checkout',
				'.fs-checkout-btn',
				'.cart-summary-overlay__actions',
				'#corner-cowi-cart-cta-wrapper',
				'.kaktusc-cart__checkout'
			],
			shadowDomTypes: [
				{
					host: '#vanga-smartcart',
					mutation: 'div.font-sans'
				}
			],
			iframeTypes: [
				{
					wrapper: '#kaktusc-app',
					mutation: '#kaktusc-root'
				}
			],
			mutations: [
				'#CartDrawer',
				'#shopify-section-quick-cart',
				'#UpcartPopup',
				'.cart-widget-side',
				'.g-popup-parent',
				'.icart .icart-main',
				'.icartFullcartContain',
				'.minicart',
				'#mini-cart',
				'#sidebar-cart',
				'.cart_content_wrap',
				'#sticky-app-client',
				'#mini__cart',
				'.popup-cart',
				'#cart-drawer',
				'#cart-modal',
				'#cart-notification',
				'#shopify-section-cart-drawer',
				'#corner-cowi-open-wrapper',
				'#drawer-modal',
				'#slidecarthq',
				"body[amote-shop='silver-rudradhan.myshopify.com'] .PageContainer"
			],
			trigger: {
				classList: [],
				timer: 0
			},
			styleCss: '',
			full_width: false,
			drawers: [
				{
					wrapper: '#CartDrawer',
					selectors: ["button[name='checkout']"]
				},
				{
					wrapper: '#upCart',
					selectors: ['.upcart-checkout-button']
				}
			],
			popups: [
				{
					wrapper: '#cart-notification',
					selectors: ['.cart-notification__links']
				}
			]
		},
		reward: {
			is_active: false,
			free_shipping_discount_code: '',
			template: 'default', // default | comfortable
			color: {
				background: 'rgba(237, 237, 237, 0.7)',
				foreground: 'rgba(0, 0, 0, 0.8)'
			},
			text_before_achieving: 'Add {amount_left} to get a {free_gift}!',
			text_after_achieving: "You're {total_amount} away from {free_gift}!",
			animation: {
				bar: false,
				reached: false
			},
			cartStyle: {
				page: true,
				drawer: true
			},
			transform: 'transform1', // transform1 || transform2
			setting: {
				condition: {
					name: 'cart_total',
					value: 1000,
					operator: '>='
				}
			},
			reward: {
				name: 'discount',
				value: {
					type: 'percentage', // percentage | fixedAmount
					value: '200'
				},
				product: {
					id: '000',
					title: 'Product 1',
					image: 'https://cdn.amote.app/assets/images/no-image.svg',
					price: 100
				}
			},
			purchase_method: 'purchase_amount', // purchase_amount | quantity_of_items
			milestones: [],
			selectors: null,
			styleCss: '',
			isShopAddCodeWhenReached: false
		},
		productUpsell: [
			{
				code: 'payment_badges',
				is_active: false,
				template: '',
				heading: 'Multiple secure payment options available',
				badges: [
					'https://cdn.amote.app/assets/badges/mastercard_color_card.svg',
					'https://cdn.amote.app/assets/badges/visa_1_color_card.svg',
					'https://cdn.amote.app/assets/badges/applepay2_color_card.svg',
					'https://cdn.amote.app/assets/badges/americanexpress_1_color_card.svg',
					'https://cdn.amote.app/assets/badges/shoppay_color_card.svg',
					'https://cdn.amote.app/assets/badges/shopify_2_color_card.svg'
				]
			},
			{
				code: 'trust_badges',
				is_active: false,
				template: '',
				heading: 'We keep your information and payment safe',
				badges: [
					'https://cdn.amote.app/assets/badges/Free_Shipping-2_gold.svg',
					'https://cdn.amote.app/assets/badges/Free_Returns-1_gold.svg',
					'https://cdn.amote.app/assets/badges/Money_Back-3_gold.svg',
					'https://cdn.amote.app/assets/badges/Premium-2_gold.svg',
					'https://cdn.amote.app/assets/badges/Satisfaction-1_gold.svg',
					'https://cdn.amote.app/assets/badges/Secure_Checkout-1_gold.svg'
				]
			},
			{
				code: 'shipping_info',
				is_active: false,
				template: 'default',
				heading: 'Shipping information',
				description_html: `
					<ul>
						<li style="color: rgb(109, 113, 117);">
							<span style="color: rgb(109, 113, 117);">Free Shipping all orders over $50 USD</span>
						</li>
						<li style="color: rgb(109, 113, 117);"><span style="color: rgb(109, 113, 117);">Estimated delivery: 1 - 3 business
								days</span>
						</li>
						<li style="color: rgb(109, 113, 117);">
							<span style="color: rgb(109, 113, 117);">Tracking available: <a href="{shopDomain}" target="_blank"
									rel="noopener">link</a></span>
						</li>
					</ul>
				`
			},
			{
				code: 'refund_info',
				is_active: false,
				template: 'default',
				heading: 'Refund information',
				description_html: `
					<ul>
						<li style="color: rgb(109, 113, 117);"><span style="color: rgb(109, 113, 117);">30-day hassle-free returns</span>
						</li>
						<li style="color: rgb(109, 113, 117);"><span style="color: rgb(109, 113, 117);">30-day money back guarantee</span>
						</li>
						<li style="color: rgb(109, 113, 117);"><span style="color: rgb(109, 113, 117);">More details about Refund policy can
								be found <a href="{shopDomain}" target="_blank" rel="noopener">link</a></span></li>
					</ul>
				`
			},
			{
				code: 'additional_info',
				is_active: false,
				template: 'default',
				heading: 'Additional information',
				description_html: `
					<p style="color: rgb(109, 113, 117);">Here are some types of information you can display in this section:</p>
					<ul>
						<li style="color: rgb(109, 113, 117);"><span style="color: rgb(109, 113, 117);">I SPENT 150$ AND SAVED 15$ FROM THE
								10% DISCOUNT CODE, HOW GREAT!</span></li>
						<li style="color: rgb(109, 113, 117);"><span style="color: rgb(109, 113, 117);">Already over 10,000 satisfied
								customers</span></li>
						<li style="color: rgb(109, 113, 117);"><span style="color: rgb(109, 113, 117);">Quality of the product is
								consistently good. 5/5⭐</span></li>
						<li style="color: rgb(109, 113, 117);"><span style="color: rgb(109, 113, 117);">Share this product on Instagram with
								hashtag #MYCHOICE to receive a discount code 15% off</span></li>
					</ul>
				`
			}
		],
		recommendation: {
			selectors: {
				cart_page: {
					wrapper: '#MainContent',
					product_list: '#cart'
				},
				cart_drawer: {
					wrapper: '#CartDrawer',
					product_list: '#CartDrawer-Form'
				}
			}
		}
	},
	appBlock: {
		quote: '#amote-quote-content',
		reward: '#amote-reward-content'
	},
	selectorsThemeDawn: [
		'.cart__ctas',
		".upcart-footer a[href='/checkout']",
		'.cart-notification__links',
		'.so-proceed-checkout-btn',
		'.CustomCartRoot_button-checkout_3__Y2'
	],
	images: {
		noImage: `${cdnUrl}/images/no-image.svg`
	}
};

export default configs;
