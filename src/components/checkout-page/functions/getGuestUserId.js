const createGuestId = () => {
  if (typeof window === "undefined") return undefined;
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export const getGuestId = () => {
  if (typeof window !== "undefined") {
    let guestId = window.localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = createGuestId();
      if (guestId) {
        window.localStorage.setItem("guest_id", guestId);
      }
    }
    return guestId;
  }
};
export const getToken = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("token");
  }
};
