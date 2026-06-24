import { useSyncExternalStore } from "react";

export interface CartItem {
  garmentId: string;
  quantity: number;
}

const STORAGE_KEY = "vestra-cart";

function loadCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function persist(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const EMPTY: CartItem[] = [];
let items: CartItem[] = EMPTY;
const listeners: Set<() => void> = new Set();
let initialized = false;

function init() {
  if (initialized) return;
  if (typeof window !== "undefined") {
    items = loadCart();
    initialized = true;
  }
}

function emit() {
  persist(items);
  listeners.forEach((fn) => fn());
}

export function addToCart(garmentId: string, qty = 1) {
  init();
  const existing = items.find((i) => i.garmentId === garmentId);
  if (existing) {
    existing.quantity += qty;
  } else {
    items = [...items, { garmentId, quantity: qty }];
  }
  emit();
}

export function removeFromCart(garmentId: string) {
  init();
  items = items.filter((i) => i.garmentId !== garmentId);
  emit();
}

export function updateQuantity(garmentId: string, quantity: number) {
  init();
  if (quantity <= 0) {
    removeFromCart(garmentId);
    return;
  }
  const existing = items.find((i) => i.garmentId === garmentId);
  if (existing) {
    existing.quantity = quantity;
    items = [...items];
  }
  emit();
}

export function clearCart() {
  items = [];
  emit();
}

export function getCartItems(): CartItem[] {
  init();
  return items;
}

export function getCartCount(): number {
  init();
  return items.reduce((s, i) => s + i.quantity, 0);
}

function subscribe(listener: () => void) {
  init();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartItem[] {
  init();
  return items;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
