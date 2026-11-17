export interface HomeProduct {
  id: number
  name: string
  category: string
  categoryName: string
  price: number
  oldPrice: number
  rating: number
  reviews: number
  image: string
  isFresh: boolean
  isOrganic: boolean
  isHotDeal: boolean
}

export interface HomeCategory {
  id: number
  name: string
  slug: string
  icon: string
  products: HomeProduct[]
}
