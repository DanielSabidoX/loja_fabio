import { Produto } from './product.type';

export interface CartItem {
  produto: Produto;
  quantidade: number;
}
