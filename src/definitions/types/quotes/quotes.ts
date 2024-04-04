export type QuoteProps = {
	page: string;
	content: string;
	author: string;
	template: string;
	position: string;
	is_active: boolean;
};

export type QuoteAppearances =
	| 'quote-sharp-light'
	| 'quote-sharp-yellow'
	| 'quote-sharp-red'
	| 'quote-sharp-blue'
	| 'quote-sharp-green'
	| 'quote-sharp-dark';

export type ShadowDomType = {
	host: string;
	observerSelector: string;
};

export type IframeDomType = {
	wrapper: string;
	observerSelector: string;
};

export type PositionSelector = {
	element: string;
};

export type Position = {
	name: string;
	selectors: PositionSelector[];
	selectorsByStore: string[];
	iframeDomSelectors: PositionSelector[];
	shadowDomSelectors: PositionSelector[];
};
