import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';export type CartItem = {
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
  private transloco = inject(TranslocoService);

  promoCode = 'CALM10';
  promoMessage = this.transloco.translate('cart.messages.calm10Applied');
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
      name: this.transloco.translate('cart.items.fieldJacket.name'),
      category: this.transloco.translate('cart.items.fieldJacket.category'),
      price: 128,
      quantity: 1,
      accent: '#214b57',
      variant: this.transloco.translate('cart.items.fieldJacket.variant'),
      delivery: this.transloco.translate('cart.items.fieldJacket.delivery'),
      image: '/assets/field_jacket_detail.png',
    },
    {
      id: 2,
      name: this.transloco.translate('cart.items.travelKit.name'),
      category: this.transloco.translate('cart.items.travelKit.category'),
      price: 46,
      quantity: 2,
      accent: '#9a5e34',
      variant: this.transloco.translate('cart.items.travelKit.variant'),
      delivery: this.transloco.translate('cart.items.travelKit.delivery'),
      image: '/assets/calm_commerce_hero.png',
    },
  ];

  readonly shipping = 12;
  readonly discountRate = 0.1; // 10% discount
  readonly taxRate = 0.08;
  readonly shippingMethods = [
    { id: 'standard', label: this.transloco.translate('cart.shippingMethods.standard.label'), price: 12, note: this.transloco.translate('cart.shippingMethods.standard.note') },
    { id: 'express', label: this.transloco.translate('cart.shippingMethods.express.label'), price: 24, note: this.transloco.translate('cart.shippingMethods.express.note') },
    { id: 'pickup', label: this.transloco.translate('cart.shippingMethods.pickup.label'), price: 0, note: this.transloco.translate('cart.shippingMethods.pickup.note') },
  ];
  readonly addOns = [
    { name: this.transloco.translate('cart.addOns.careSpray'), price: 18, accent: '#76806f' },
    { name: this.transloco.translate('cart.addOns.giftWrap'), price: 8, accent: '#b57a3a' },
    { name: this.transloco.translate('cart.addOns.warrantyCard'), price: 12, accent: '#36596a' },
  ];

  get selectedShippingCost(): number {
    return this.shippingMethods.find((method) => method.id === this.selectedShipping)?.price ?? this.shipping;
  }

  get discount(): number {
    return this.promoCode.trim().toUpperCase() === 'CALM10' && this.promoMessage !== this.transloco.translate('cart.messages.calm10Invalid') && this.promoMessage !== '' ? Math.round(this.subtotal * this.discountRate) : 0;
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
      this.promoMessage = this.transloco.translate('cart.messages.calm10Applied');
    } else if (this.promoCode.trim() === '') {
      this.promoMessage = '';
    } else {
      this.promoMessage = this.transloco.translate('cart.messages.calm10Invalid');
    }
  }

  addOn(name: string, price: number): void {
    // Check if item already exists in the cart as an add-on
    const existing = this.items.find((item) => item.name === name);
    if (existing) {
      existing.quantity++;
      this.promoMessage = this.transloco.translate('cart.messages.increasedQuantity', { name });
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        name: name,
        category: this.transloco.translate('cart.items.addonCategory'),
        price: price,
        quantity: 1,
        accent: '#5d625d',
        variant: this.transloco.translate('cart.items.addonVariant'),
        delivery: this.transloco.translate('cart.items.addonDelivery'),
        image: '/assets/calm_commerce_hero.png',
      };
      this.items = [...this.items, newItem];
      this.promoMessage = this.transloco.translate('cart.messages.addedAddon', { name });
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
