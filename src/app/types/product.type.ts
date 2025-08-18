export type Rating = {
  rate: number;
  count: number;
};

export type Produto = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
};

export type Categories = {
    name: string;
}