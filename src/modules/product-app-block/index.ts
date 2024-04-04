import configs from '_/helpers/configs';
import Utils from '_/helpers/utils';
import Services from '_/services';
import Appearances from './appearances';
import { AMOTE_BLOCKS } from './constants';

class ProductAppBlock {
	private blocks: any = configs.default.productUpsell;

	async render(): Promise<void> {
		await this.fetchData();
		if (Utils.isStorefront()) {
			this.loadBlocksOnStoreFront();
		}
	}

	// === start handle Data
	private async fetchData(): Promise<void> {
		try {
			const services = new Services();
			const res: any = await services.getBlocks();

			if (res) {
				this.mergeData(res);
			}
		} catch (error) {
			console.error(error);
		}
	}

	private mergeData(blocks: any): void {
		this.blocks = [...this.blocks, ...blocks];
	}

	// === end handle Data

	// === start handle render blocks
	loadBlocksOnStoreFront() {
		if (this.blocks && this.blocks.length > 0) {
			// filter block active;
			const blocksActive = this.blocks.filter((block: any) => block.is_active);

			if (blocksActive.length > 0) {
				blocksActive.forEach((block: any) => {
					const blockByType = new BlockByType();
					blockByType.init(block);
				});
			}
		}
	}

	// === end handle render blocks
}

class BlockByType {
	private block: any = null;

	init(block: any) {
		this.block = { ...block };
		this.render();
	}

	render() {
		try {
			const { code, description_html = '' } = this.block;
			const classBlock = AMOTE_BLOCKS[code];
			const elmntBlocks: any = document.querySelectorAll(classBlock);
			const appearances = new Appearances();

			appearances.load(this.block);

			if (elmntBlocks && elmntBlocks.length > 0) {
				elmntBlocks.forEach((block: any) => {
					block.innerHTML = appearances.getStringHTMLBlock();

					// for block info
					const elmntDesc = block.querySelector('.amote-block-info__desc');
					if (elmntDesc) {
						elmntDesc.style.display = 'block';
						const shadow = elmntDesc.attachShadow({ mode: 'open' });
						if (shadow) {
							shadow.innerHTML = `
                                <style>
                                    .amoteDescription {
                                        overflow-wrap: anywhere;
                                    }
                                    ul { padding-left: 18px!important; }
                                </style>
                            `;
							const template = document.createElement('template');
							template.innerHTML = `<div class="amoteDescription">${description_html}</div>`;
							shadow.appendChild(template.content.cloneNode(true));
						}
					}
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	isBadge(code: string) {
		const blockType = ['payment_badges', 'trust_badges'];
		return blockType.includes(code);
	}
}

export default ProductAppBlock;
