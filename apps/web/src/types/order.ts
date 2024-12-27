export interface Order {
  id: string
  orderNumber: string
  customer: string
  status: 'pending' | 'processing' | 'ready' | 'delivery' | 'completed'
  total: number
  paymentMethod: 'credit_card' | 'debit_card' | 'pix' | 'money'
  items: {
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }[]
  observation?: string
  createdAt: string
}
