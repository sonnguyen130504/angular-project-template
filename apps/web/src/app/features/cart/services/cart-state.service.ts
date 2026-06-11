import { Injectable } from '@angular/core';

export type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  accent: string;
  variant: string;
  delivery: string;
  image: string;
};

@Injectable()
export class CartStateService {
  promoCode = 'CALM10';
  promoMessage = 'CALM10 discount ($10.00) is applied.';
  activeStep = 1;
  selectedShipping = 'standard';
  selectedPayment = 'card';
  savedForLater: CartItem[] = [];

  // Address checkout form fields
  shippingAddress = {
    fullName: 'Son Nguyen',
    email: 'son.nguyen@example.com',
    street: '123 Calm Commerce Street',
    city: 'Hanoi',
    zipCode: '100000',
  };

  // Payment mock fields
  paymentInfo = {
    cardNumber: '•••• •••• •••• 4242',
    expiry: '12/28',
    cvv: '•••',
  };

  items: CartItem[] = [
    {
      id: 1,
      name: 'Field Jacket',
      category: 'Outerwear',
      price: 128,
      quantity: 1,
      accent: '#214b57',
      variant: 'Deep Teal / M',
      delivery: 'Arrives Jun 14-17',
      image: '/assets/field_jacket_detail.png',
    },
    {
      id: 2,
      name: 'Travel Kit',
      category: 'Accessories',
      price: 46,
      quantity: 2,
      accent: '#9a5e34',
      variant: 'Clay / One size',
      delivery: 'Pickup ready tomorrow',
      image: '/assets/calm_commerce_hero.png',
    },
  ];

  readonly shipping = 12;
  readonly discountRate = 0.1; // 10% discount
  readonly taxRate = 0.08;
  readonly shippingMethods = [
    { id: 'standard', label: 'Standard Delivery', price: 12, note: 'Jun 14-17' },
    { id: 'express', label: 'Express Delivery', price: 24, note: 'Jun 12-13' },
    { id: 'pickup', label: 'Store Pickup', price: 0, note: 'Tomorrow' },
  ];
  readonly addOns = [
    { name: 'Care Spray', price: 18, accent: '#76806f' },
    { name: 'Gift Wrap', price: 8, accent: '#b57a3a' },
    { name: 'Warranty Card', price: 12, accent: '#36596a' },
  ];

  get selectedShippingCost(): number {
    return this.shippingMethods.find((method) => method.id === this.selectedShipping)?.price ?? this.shipping;
  }

  get discount(): number {
    return this.promoMessage.includes('applied') ? Math.round(this.subtotal * this.discountRate) : 0;
  }

  get tax(): number {
    return Math.round((this.subtotal - this.discount) * this.taxRate);
  }

  get subtotal(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  get total(): number {
    if (this.items.length === 0) {
      return 0;
    }
    return Math.max(this.subtotal + this.selectedShippingCost + this.tax - this.discount, 0);
  }

  increment(itemId: number): void {
    this.updateQuantity(itemId, 1);
  }

  decrement(itemId: number): void {
    this.updateQuantity(itemId, -1);
  }

  remove(itemId: number): void {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  saveForLater(item: CartItem): void {
    this.savedForLater = [...this.savedForLater, item];
    this.remove(item.id);
  }

  moveToCart(item: CartItem): void {
    this.items = [...this.items, item];
    this.savedForLater = this.savedForLater.filter((i) => i.id !== item.id);
  }

  applyPromo(): void {
    if (this.promoCode.trim().toUpperCase() === 'CALM10') {
      this.promoMessage = 'CALM10 discount (10%) is applied.';
    } else if (this.promoCode.trim() === '') {
      this.promoMessage = '';
    } else {
      this.promoMessage = 'That code is not valid for this basket.';
    }
  }

  addOn(name: string, price: number): void {
    // Check if item already exists in the cart as an add-on
    const existing = this.items.find((item) => item.name === name);
    if (existing) {
      existing.quantity++;
      this.promoMessage = `Increased quantity of ${name}.`;
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        name: name,
        category: 'Add-on',
        price: price,
        quantity: 1,
        accent: '#5d625d',
        variant: 'Standard / One size',
        delivery: 'Ships with order',
        image: '/assets/calm_commerce_hero.png',
      };
      this.items = [...this.items, newItem];
      this.promoMessage = `Added ${name} add-on to order.`;
    }
  }

  nextStep(): void {
    if (this.activeStep < 4) {
      this.activeStep++;
    }
  }

  prevStep(): void {
    if (this.activeStep > 1) {
      this.activeStep--;
    }
  }

  private updateQuantity(itemId: number, delta: number): void {
    this.items = this.items.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item,
    );
  }
}
