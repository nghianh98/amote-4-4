const THEME_ID_DEFAULT = 887;

const TAGS: any = {
	amount_left: ''
};

const REWARD_TYPES = {
	progressBar: 'progress-bar',
	discount: 'discount',
	discountTotals: 'discount-totals',
	freeGift: 'free-gift'
};

const CART_ITEMS_DEFAULT = {
	wrapper: '.cart-items',
	item: '.cart-item'
};

const TEXT_DISCOUNT: any = {
	default: {
		subTotal: 'Subtotal',
		saving: 'Saving',
		estTotal: 'EST total'
	},
	'08542e.myshopify.com': {
		subTotal: 'ursprüngliche Summe',
		saving: 'gespart',
		estTotal: 'neue Summe'
	}
};

const SELECTORS = {
	// 1864 Publisher
	887: {
		// Dawn
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '.cart__items', // before
			rewardFreeGift: '.cart__items', // after
			rewardDiscount: '.cart__footer .cart__blocks', // prepend
			footer: {
				wrapper: '.cart__footer .cart__blocks', // prepend
				hide: ['.totals', '.discounts', '.discounts__discount']
			},
			cartItems: {
				wrapper: '.cart-items',
				item: '.cart-item'
			},
			detectChange: '.cart__items'
		},
		cartDrawer: {
			wrapper: 'cart-drawer',
			progressBar: '#CartDrawer-Form',
			rewardFreeGift: '#CartDrawer-Form',
			rewardDiscount: '.cart-drawer__footer',
			footer: {
				wrapper: '.cart-drawer__footer',
				hide: ['.totals', '.discounts']
			},
			cartItems: {
				wrapper: '.cart-items',
				item: '.cart-item'
			},
			notCalcPositionGift: true // top 0, left 50%
		}
	},
	796: {
		// Debut
		cartPage: {
			wrapper: 'form.cart',
			progressBar: 'table',
			rewardFreeGift: 'table',
			rewardDiscount: '.cart__footer .grid',
			footer: {
				wrapper: '.cart__footer .grid',
				hide: ['.cart-subtotal__title', '.cart-subtotal__price']
			},
			detectChange: 'table',
			formSubmit: "input[name='checkout']"
		}
	},
	847: {
		// Motion
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '.cart__item--headers',
			rewardFreeGift: 'div[data-products]',
			rewardDiscount: '.cart__footer',
			footer: {
				wrapper: '.cart__footer',
				hide: ['.totals', '.discounts', '.cart__subtotal', 'div[data-subtotal]', '.cart__savings']
			},
			detectChange: '.cart__footer div[data-subtotal]'
		},
		cartDrawer: {
			wrapper: '#CartDrawer',
			progressBar: '.drawer__scrollable',
			rewardFreeGift: '.drawer__scrollable',
			rewardDiscount: '.drawer__footer',
			footer: {
				wrapper: '.drawer__footer',
				hide: ['.cart__item-sub']
			},
			detectChange: '.drawer__footer div[data-subtotal]',
			notCalcPositionGift: true
		}
	},
	855: {
		// Prestige
		cartPage: {
			wrapper: '#main',
			progressBar: '.Cart__ItemList',
			rewardFreeGift: '.Cart__ItemList',
			rewardDiscount: '.Cart__Footer .Cart__Recap',
			footer: {
				wrapper: '.Cart__Footer .Cart__Recap',
				hide: ['.Cart__Discount', '.Cart__Total']
			}
		},
		cartDrawer: {
			wrapper: '#sidebar-cart',
			progressBar: '.Cart__ItemList',
			rewardFreeGift: '.Cart__ItemList',
			rewardDiscount: '.Drawer__Footer',
			footer: {
				wrapper: '.Drawer__Footer',
				hide: ['.Cart__Discount', '.Cart__Taxes']
			},
			notCalcPositionGift: true
		}
	},
	857: {
		// Impulse
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '.cart__page',
			rewardFreeGift: '.cart__page',
			rewardDiscount: '.cart__page .cart__page-col:nth-child(2)',
			footer: {
				wrapper: '.cart__page-col:nth-child(2)',
				hide: ['.cart__discounts', 'afterpay-placement', '.cart__item-sub']
			},
			detectChange: '.cart__page .cart__page-col:nth-child(1)'
		},
		cartDrawer: {
			wrapper: '#CartDrawerForm',
			progressBar: '.drawer__inner',
			rewardFreeGift: '.drawer__inner',
			rewardDiscount: '.drawer__footer',
			footer: {
				wrapper: '.drawer__footer',
				hide: ['.cart__item-sub']
			},
			detectChange: '.ajaxcart__subtotal + div'
		}
	},
	868: {
		// Broadcast
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '.cart__items', // before
			rewardFreeGift: '.cart__items', // after
			rewardDiscount: '.cart__aside[data-foot-holder]', // prepend
			footer: {
				wrapper: '.cart__aside[data-foot-holder]', // prepend
				hide: ['.cart__total', '.cart__discounts', '.discounts__discount']
			},
			detectChange: '.cart__items'
		},
		cartDrawer: {
			wrapper: '#cart-dropdown',
			progressBar: '.cart-dropdown__items',
			rewardFreeGift: '.cart-dropdown__items',
			rewardDiscount: '.cart__foot-inner',
			footer: {
				wrapper: '.cart__foot-inner',
				hide: ['.cart__total', '.cart__discounts', '.discounts__discount']
			},
			detectChange: '.cart-dropdown__items',
			notCalcPositionGift: true
		}
	},
	871: {
		// Warehouse
		cartPage: {
			wrapper: '#main',
			progressBar: '.card',
			rewardFreeGift: '.card',
			rewardDiscount: '.cart-recap .card__section',
			footer: {
				wrapper: '.cart-recap .card__section',
				hide: ['.cart-recap__price-line', '.cart-recap__price-line', '.cart-recap__amount-saved']
			}
		},
		cartDrawer: {
			wrapper: '#mini-cart',
			progressBar: '.mini-cart__content',
			rewardFreeGift: '.mini-cart__content',
			rewardDiscount: '.mini-cart__recap',
			footer: {
				wrapper: '.mini-cart__recap',
				hide: ['.mini-cart__recap-price-line', '.mini-cart__price-line', '.mini-cart__amount-saved']
			}
		}
	},
	1190: {
		// Impact
		cartPage: {
			wrapper: '.shopify-section--main-cart',
			progressBar: '.cart-order',
			rewardFreeGift: 'table',
			rewardDiscount: '.cart-form',
			footer: {
				wrapper: '.cart-form',
				hide: ['.cart-form__totals div:nth-child(1)', '.cart-form__totals div:nth-child(1)']
			}
		},
		cartDrawer: {
			wrapper: 'cart-drawer',
			progressBar: '.cart-drawer__line-items',
			rewardFreeGift: '.cart-drawer__line-items',
			rewardDiscount: "div[slot='footer']",
			footer: {
				wrapper: "div[slot='footer']",
				hide: ['.h-stack']
			},
			detectChange: '.cart-drawer__line-items'
		}
	},
	1356: {
		// Sense
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '#cart',
			rewardFreeGift: '#cart',
			rewardDiscount: '.cart__footer .cart__blocks',
			footer: {
				wrapper: '.cart__footer .cart__blocks',
				hide: ['.totals', '.discounts']
			},
			detectChange: '#cart'
		},
		cartDrawer: {
			wrapper: '#CartDrawer',
			progressBar: '.cart-items',
			rewardFreeGift: '.cart-items',
			rewardDiscount: '.cart-drawer__footer',
			footer: {
				wrapper: '.cart-drawer__footer',
				hide: ['.totals__subtotal', '.totals__subtotal-value', '.discounts__discount']
			},
			notCalcPositionGift: true
		}
	},
	1363: {
		// Crave
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '#cart',
			rewardFreeGift: '#cart',
			rewardDiscount: '.cart__footer .cart__blocks',
			footer: {
				wrapper: '.cart__footer .cart__blocks',
				hide: ['.totals', '.discounts']
			},
			detectChange: '#cart'
		},
		cartDrawer: {
			wrapper: '#CartDrawer',
			progressBar: '#CartDrawer-Form',
			rewardFreeGift: '#CartDrawer-Form',
			rewardDiscount: '.cart-drawer__footer',
			footer: {
				wrapper: '.cart-drawer__footer',
				hide: ['.totals', '.discounts']
			},
			notCalcPositionGift: true
		}
	},
	1368: {
		// Craft
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '#cart',
			rewardFreeGift: '#cart',
			rewardDiscount: '.cart__footer .cart__blocks',
			footer: {
				wrapper: '.cart__footer .cart__blocks',
				hide: ['.totals', '.discounts']
			},
			detectChange: '#cart'
		},
		cartDrawer: {
			wrapper: '#slidecarthq',
			progressBar: '.items',
			rewardFreeGift: '.items',
			rewardDiscount: '.footer',
			footer: {
				wrapper: '.footer',
				hide: ['.footer-row:nth-child(2)']
			},
			detectChange: '.items'
		}
	},
	1431: {
		// Studio
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '.cart__items',
			rewardFreeGift: '.cart__items',
			rewardDiscount: '.cart__footer .cart__blocks',
			footer: {
				wrapper: '.cart__footer .cart__blocks',
				hide: ['.totals', '.discounts__discount ']
			},
			detectChange: '.cart__items'
		},
		cartDrawer: {
			wrapper: '#CartDrawer',
			progressBar: 'cart-drawer-items',
			rewardFreeGift: 'cart-drawer-items',
			rewardDiscount: '.cart-drawer__footer',
			footer: {
				wrapper: '.cart-drawer__footer',
				hide: ['.totals', '.discounts__discount']
			},
			detectChange: 'cart-drawer-items'
		}
	},
	1434: {
		// Taste
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '#cart',
			rewardFreeGift: '#cart',
			rewardDiscount: '.cart__footer .cart__blocks',
			footer: {
				wrapper: '.cart__footer .cart__blocks',
				hide: ['.totals', '.discounts__discount ']
			},
			detectChange: '#cart'
		},
		cartDrawer: {
			wrapper: '#CartDrawer',
			progressBar: 'cart-drawer-items',
			rewardFreeGift: 'cart-drawer-items',
			rewardDiscount: '.drawer__footer',
			footer: {
				wrapper: '.drawer__footer',
				hide: ['.totals', '.discounts__discount']
			},
			detectChange: 'cart-drawer-items'
		}
	},
	1499: {
		// Colorblock
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '#cart',
			rewardFreeGift: '#cart',
			rewardDiscount: '.cart__footer .cart__blocks',
			footer: {
				wrapper: '.cart__footer .cart__blocks',
				hide: ['.totals', '.discounts']
			},
			detectChange: '#cart'
		}
	},
	1500: {
		// Ride
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '#cart',
			rewardFreeGift: '#cart',
			rewardDiscount: '.cart__footer .cart__blocks',
			footer: {
				wrapper: '.cart__footer .cart__blocks',
				hide: ['.totals', '.discounts', '.discounts__discount']
			},
			detectChange: '#cart'
		},
		cartDrawer: {
			wrapper: '#CartDrawer',
			progressBar: '.cart-items',
			rewardFreeGift: '.cart-items',
			rewardDiscount: '.cart-drawer__footer',
			footer: {
				wrapper: '.cart-drawer__footer',
				hide: ['.discounts.list-unstyled', '.totals__subtotal', '.totals__subtotal-value']
			},
			notCalcPositionGift: true
		}
	},
	1567: {
		// Refresh
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '#cart',
			rewardFreeGift: '#cart',
			rewardDiscount: '.cart__footer .cart__blocks',
			footer: {
				wrapper: '.cart__footer .cart__blocks',
				hide: ['.totals', '.discounts']
			},
			detectChange: '.cart__footer .js-contents'
		},
		cartDrawer: {
			wrapper: '#CartDrawer',
			progressBar: '.cart-items',
			rewardFreeGift: '.cart-items',
			rewardDiscount: '.cart-drawer__footer',
			footer: {
				wrapper: '.cart-drawer__footer',
				hide: ['.discounts.list-unstyled', '.totals__subtotal', '.totals__subtotal-value']
			},
			notCalcPositionGift: true
		}
	},
	1615: {
		// Yuva
		cartPage: {
			wrapper: 'div[data-cart-form]',
			progressBar: '#cart',
			rewardFreeGift: '#cart',
			rewardDiscount: '.cart-total-details',
			footer: {
				wrapper: '.cart-total-details',
				hide: ['.cart-total-item']
			},
			detectChange: '#cart'
		},
		cartDrawer: {
			wrapper: '#mini__cart',
			progressBar: '.cart-items-wrapper',
			rewardFreeGift: '.cart-items-wrapper .media-link:last-child',
			rewardDiscount: '.bottom-cart-box',
			footer: {
				wrapper: '.bottom-cart-box',
				hide: ['.totle-price']
			}
		}
	},
	1654: {
		// Fancyarn
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '.Cart__ItemList',
			rewardFreeGift: '.Cart__ItemList',
			rewardDiscount: '.Cart_SidebarSide .cart__block',
			footer: {
				wrapper: '.Cart_SidebarSide .cart__block',
				hide: ['.docapp-cart-subtotal']
			}
		},
		cartDrawer: {
			wrapper: '#sidebar-cart',
			progressBar: '.Cart__ItemList',
			rewardFreeGift: '.Cart__ItemList',
			rewardDiscount: '.Drawer__Footer .cart-drawer-container',
			footer: {
				wrapper: '.Drawer__Footer .cart-drawer-container',
				hide: ['.docapp-cart-subtotal']
			},
			isDetectMousedown: 'true'
		}
	},
	1841: {
		// Origin
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '#cart',
			rewardFreeGift: '#cart',
			rewardDiscount: '.cart__footer .cart__blocks',
			footer: {
				wrapper: '.cart__footer .cart__blocks',
				hide: ['.totals', '.discounts']
			},
			detectChange: '#cart'
		},
		cartDrawer: {
			wrapper: '#CartDrawer',
			progressBar: '.cart-items',
			rewardFreeGift: '.cart-items',
			rewardDiscount: '.cart-drawer__footer',
			footer: {
				wrapper: '.cart-drawer__footer',
				hide: ['.discounts.list-unstyled', '.totals__subtotal', '.totals__subtotal-value']
			},
			notCalcPositionGift: true
		}
	},
	1891: {
		// Spotlight
		cartPage: {
			wrapper: '#MainContent',
			progressBar: '#cart',
			rewardFreeGift: '#cart',
			rewardDiscount: '.cart__footer .cart__blocks',
			footer: {
				wrapper: '.cart__footer .cart__blocks',
				hide: ['.totals', '.discounts']
			},
			detectChange: '#cart'
		},
		cartDrawer: {
			wrapper: '#CartDrawer',
			progressBar: '.cart-items',
			rewardFreeGift: '.cart-items',
			rewardDiscount: '.cart-drawer__footer',
			footer: {
				wrapper: '.cart-drawer__footer',
				hide: ['.discounts.list-unstyled', '.totals__subtotal', '.totals__subtotal-value']
			},
			notCalcPositionGift: true
		}
	}
};

const SHOP_ADD_CODE_REACHED = ['atomiclabatory.myshopify.com', 'tanktation.myshopify.com', '42580c-2.myshopify.com'];

export { SELECTORS, TAGS, REWARD_TYPES, THEME_ID_DEFAULT, CART_ITEMS_DEFAULT, SHOP_ADD_CODE_REACHED, TEXT_DISCOUNT };
