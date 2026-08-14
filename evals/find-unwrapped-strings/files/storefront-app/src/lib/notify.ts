const messages: Record<string, string> = {
  added: "Added to your cart",
  removed: "Removed from your cart",
  network: "Connection lost. Retry in a moment.",
};

export function notify(key: string): void {
  const text = messages[key] ?? messages.network;
  console.log("notify:", key);
  document.dispatchEvent(new CustomEvent("toast", { detail: text }));
}
