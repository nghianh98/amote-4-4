import configs from '_/helpers/configs';
import Utils from '_/helpers/utils';
import { CLASS_QUOTE } from './contants';

class Appearances {
	private widgetName = 'quote';

	createMarkup(data: any) {
		const { content, author, template, full_width } = data;

		const classIsLocal = !Utils.isStorefront() ? 'is-local' : '';

		const htmlQuote = `
			<div 
				class="amote-app ${classIsLocal}" 
				widget="${this.widgetName}" 
				template="${this.getTemplateQuote(template)}"
				full-width="${full_width}"
			>
				<div class="${this.widgetName}-content">
					${content}
				</div>
				<div class="${this.widgetName}-author">${author}</div>
			</div>
		`;

		return htmlQuote;
	}

	getTemplateQuote(template: string) {
		const classQuote: any = CLASS_QUOTE;

		return classQuote[template];
	}
}

export default Appearances;
