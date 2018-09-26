export class Message {
	constructor(
		public _id: string,
		public text: string,
		public viewed: string,
		public created_st: string,
		public emitter: string,
		public receiver: string
	){}
}
