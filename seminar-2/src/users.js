// Зөвхөн сургалтын жишээ өгөгдөл.
export const users = [
  { id: 1, name: "Bat", email: "bat@example.com", role: "ADMIN", password: "demo-1" },
  { id: 2, name: "Sarnai", email: "sarnai@example.com", role: "USER", password: "demo-2" },
  { id: 3, name: "Dorj", email: "dorj@example.com", role: "USER", password: "demo-3" },
  { id: 4, name: "Tuya", email: "tuya@example.com", role: "ADMIN", password: "demo-4" }
];

export function findUserById(id) {
  return users.find((user) => user.id === id);
}

export function findByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function countAdmins() {
  return users.filter((user) => user.role === "ADMIN").length;
}

export function withoutPassword(user) {
  const { password, ...publicUser } = user;
  return publicUser;
}
