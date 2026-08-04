export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("ru-RU");

export const toDateInput = (iso: string) => iso.slice(0, 10);

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
