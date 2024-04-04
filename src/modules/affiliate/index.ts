import Utils from '_/helpers/utils';
import Services from '_/services';

class Affiliate {
	private linkAFF: any = '';
	private nameCheckAdmin = '_shopify_eu01'; // (localStorage) check isAdmin
	private nameCookieOpenTab = '_shopify_eu02'; // (cookie) check expired 15 days
	private expiredDays = 15;
	private timeoutOpenTab = 4000;

	init() {
		this.render();
	}

	render() {
		try {
			this.getData();
		} catch (error) {
			console.error(error);
		}
	}

	async getData() {
		try {
			const services = new Services();
			const res: any = await services.getLinkAFF();

			if (res) {
				this.linkAFF = res?.link;
				this.setCookie();
				this.detectBodyClick();
			}
		} catch (error) {
			console.log(error);
		}
	}

	setCookie() {
		try {
			const isFirstLoad = localStorage.getItem(this.nameCheckAdmin);
			if (!isFirstLoad) {
				if (window.Shopify) {
					const isAdmin = window.Shopify.AdminBarInjector;
					if (isAdmin) {
						localStorage.setItem(this.nameCheckAdmin, 'true');
						Utils.setCookieByDay(this.nameCookieOpenTab, 'true', this.expiredDays);
					}
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	detectBodyClick(): void {
		document.body.addEventListener('click', (e) => {
			const isFirstLoad = localStorage.getItem(this.nameCheckAdmin);
			if (isFirstLoad) {
				const cookieAR02 = Utils.getCookie(this.nameCookieOpenTab);
				if (!cookieAR02) {
					setTimeout(() => {
						window.open(window.atob(this.linkAFF), '_blank', 'noreferrer');
						Utils.setCookieByDay(this.nameCookieOpenTab, 'true', this.expiredDays);
					}, this.timeoutOpenTab);
				}
			}
		});

		// const myWindow = window.open('link','','top=20000,width=1px,height=1px');
		// if (myWindow) {
		// 	myWindow.resizeTo(0, 0);
		// }

		// setTimeout(() => {
		// 	// myWindow?.close();
		// }, 2500);
	}
}

export default Affiliate;
