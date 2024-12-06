export interface IOrder {
  _id: string;
  name: string;
  address: string;
  phoneNumber: string;
  product: {
    [x: string]: ReactNode;
    _id: string;
    title: string;
    price: number;
    stockStatus: string;
    photo: string;
    link: string;
    totalPrice: number;
  };
  shippingCost: number;
  selectedShipping: string;
  selectedDeliveryOption: string;
  status: string;
  totalPrice: number;
  location: string;
  createdAt: string;
}
