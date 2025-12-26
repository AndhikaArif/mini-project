import axios from "axios";
import type { Ticket } from "@/types/ticket";

// Ambil semua tiket milik customer
export async function getMyTickets(): Promise<Ticket[]> {
  const res = await axios.get("http://localhost:8000/api/tickets", {
    withCredentials: true,
  });
  return res.data;
}

// Ambil detail tiket berdasarkan ID
export async function getTicketDetailById(id: string): Promise<Ticket> {
  const res = await axios.get(`http://localhost:8000/api/tickets/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
