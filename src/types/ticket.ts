export interface ITicket {
  id: string;
  ticket_id: string;
	reported_by?: string;
	accommodation_name: string;
	accommodation_room_number?: string;
	accommodation_specific_location: string;
	accommodation_type: string;
	request_type: string;
	request_detail: string;
	task_status: string;
	task_priority: string;
	alert_level: number;
	assigned_to: string;
	note?: string;
	image?: Uint8Array;
  created_date: string;
  completed_date: string;
}

export interface ITicketRequest {
	reported_by?: string;
	accommodation_name?: string;
	accommodation_room_number?: string;
	accommodation_specific_location?: string;
	accommodation_type?: string;
	request_type?: string;
	request_detail?: string;
	task_priority?: string;
	assigned_to?: string;
	note?: string;
	//image?: Uint8Array;
}