import type { ITicketRequest } from "../types/ticket";
import api from "./api";

class TicketService {
  createTicket(ticket: ITicketRequest) {
    return api.post("/tickets", ticket);
  }

  getTickets() {
    return api.get("/tickets");
  }

  getTicket(id: string) {
    return api.get("/tickets/" + id);
  }

  updateTicket(id: string, ticket: ITicketRequest) {
    return api.patch("/tickets/" + id, ticket);
  }

  pendingTicket(id: string, fullName: string) {
    return api.patch("/tickets/" + id + "/pending", fullName);
  }

  completedTicket(id: string, fullName: string) {
    return api.patch("/tickets/" + id + "/completed", fullName);
  }

  deleteTicket(id: string) {
    return api.delete("/tickets/" + id);
  }
}

export default new TicketService();