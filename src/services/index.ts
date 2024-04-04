import axios from 'axios';
import apiUrls from '_/helpers/apiUrls';
import Utils from '_/helpers/utils';
import { QuoteProps } from '_/definitions/types/quotes';
import { RewardSettings } from '_/definitions/types/reward';

class Services {
	private async fetchApi(url: string) {
		const domain = window.Shopify.shop ? 'qtt-amt-local-22.myshopify.com' : 'domain-test.myshopify.com';
		// const domain = window.Shopify.shop ? window.Shopify.shop : 'domain-test.myshopify.com';
		const response = await fetch(`${apiUrls.baseUrl}${url}?shop=${domain}`);
		const data = await response.json();
		return data;
	}

	private async fetchApiProduct(url: string) {
		const domain = window.Shopify.shop ? window.Shopify.shop : 'domain-test.myshopify.com';
		const response = await fetch(`${apiUrls.baseUrl}${url}`, {
			headers: {
				'X-Shopify-Domain': domain
			}
		});

		if (response.status === 200) {
			return response;
		} else {
			throw null;
		}
	}

	private async fetchApiShopify(api: string, method = 'GET', body = null) {
		const shop = window.Shopify ? window.Shopify.shop : null;

		if (shop) {
			const url = `https://${shop}${api}`;
			let params: any = {
				method,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			if (body) {
				params.body = JSON.stringify(body);
			}

			const response = await fetch(url, params);
			const data = await response.json();
			return data;
		}

		return null;
	}

	private async fetchApiByURL(url: string) {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	}

	async getQuotes(): Promise<QuoteProps[]> {
		const data = await this.fetchApi(apiUrls.quotes.get);
		return data;
	}

	async getReward(): Promise<RewardSettings[]> {
		const data = await this.fetchApi(apiUrls.reward.get);
		return data;
	}

	async getRecommendProduct(): Promise<any> {
		const data = await this.fetchApi(apiUrls.product.getRecommend);
		return data;
	}

	async getInfoVariant(id: any): Promise<any> {
		const data = await this.fetchApi(apiUrls.product.getInfoVariant + id);
		return data;
	}

	async getJSONProductByHandle(handle: String): Promise<Object> {
		const res = await axios.get(`/products/${handle}.json`);
		return res;
	}

	async getCart(): Promise<Object> {
		const res = await axios.get(apiUrls.cart.get);
		return res;
	}

	async addCart(data: any) {
		try {
			const res = await axios.post(apiUrls.cart.postAdd, data);
			return res;
		} catch (error) {
			return error;
		}
	}

	async updateCart(data: any): Promise<Object> {
		const res = await axios.post(apiUrls.cart.postUpdate, data);
		return res;
	}

	async changeCart(data: any): Promise<Object> {
		const res = await axios.post(apiUrls.cart.postChange, data);
		return res;
	}

	async addCodeFreeShipping(code: any): Promise<Object> {
		const res = await axios.get(apiUrls.cart.addCodeFreeShipping + code);
		return res;
	}

	// async getProduct(product_id: any): Promise<Object> {
	async getProduct(product_id: any) {
		const data = await this.fetchApi(`${apiUrls.product.get}/${product_id}`);
		return data;
	}

	async getBlocks(): Promise<Object> {
		const res = await this.fetchApi(apiUrls.blocks.get);
		return res;
	}

	async getLinkAFF(): Promise<Object> {
		const res = await this.fetchApiByURL(window.atob(apiUrls.linkAff.get));
		return res;
	}
}

export default Services;
