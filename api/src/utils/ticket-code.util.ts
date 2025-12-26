export function generateTicketCode(eventName: string) {
  const slug = eventName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);

  const random = Math.floor(100000 + Math.random() * 900000);

  return `${slug}-${random}`;
}
