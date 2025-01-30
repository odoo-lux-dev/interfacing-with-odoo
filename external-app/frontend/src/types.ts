export interface Partner {
	id: number;
	display_name: string;
}

export interface Croissantage {
	id: number;
	name: string;
	partner_id: Partner;
	partner_ids: number[];
}

export interface WebhookMessageBase {
	id: number;
	name: string;
	completeBody: any;
	complexity?: "simple" | "complex";
}

export interface WebhookReceivedMessage extends WebhookMessageBase {
	type: "received";
}

export interface WebhookSentMessage extends WebhookMessageBase {
	type: "sent";
}
