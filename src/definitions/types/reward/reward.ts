type Color = {
	background: string;
	foreground: string;
};

type Reward = {
	name: string;
	value: Object;
};

type Animation = {
	bar: boolean;
	reached: boolean;
};

export type RewardSettings = {
	template: string;
	color: Color;
	setting: Object;
	reward: Reward;
	text_before_achieving: string;
	text_after_achieving: string;
	animation: Animation;
	selectors: Object;
};
