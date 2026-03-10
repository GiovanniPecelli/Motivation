import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  variant_id?: string
  quantity: number
  created_at: string
  updated_at: string
  products: {
    id: string
    title: string
    price: number
    images: string[]
    category: string
  }
  product_variants?: {
    id: string
    size: string
    color: string
    color_hex: string
    supply: number
  }
}

interface CartContextType {
  cartItems: CartItem[]
  loading: boolean
  addToCart: (productId: string, quantity: number) => Promise<{ error: any }>
  removeFromCart: (productId: string) => Promise<{ error: any }>
  updateQuantity: (productId: string, quantity: number) => Promise<{ error: any }>
  clearCart: () => Promise<{ error: any }>
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()

  useEffect(() => {
    if (profile) {
      fetchCartItems()
    } else {
      setCartItems([])
      setLoading(false)
    }
  }, [profile])

  const fetchCartItems = async () => {
    try {
      if (!profile) return

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            title,
            price,
            category
          ),
          product_variants (
            id,
            color,
            color_hex,
            images
          )
        `)
        .eq('user_id', profile.id)

      if (error) {
        console.error('Error fetching cart items:', error)
        return
      }

      setCartItems(data || [])
    } catch (error) {
      console.error('Error in fetchCartItems:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number) => {
    try {
      if (!profile) return { error: 'User not authenticated' }

      // Check if product exists and is active
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('is_active')
        .eq('id', productId)
        .single()

      if (productError || !product) {
        return { error: 'Product not found' }
      }

      if (!product.is_active) {
        return { error: 'Product is not available' }
      }

      // Check if item already in cart
      const existingItem = cartItems.find(item => item.product_id === productId)

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity
        
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.id)

        if (error) return { error }

        await fetchCartItems()
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: profile.id,
            product_id: productId,
            quantity
          })

        if (error) return { error }

        await fetchCartItems()
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      if (!profile) return { error: 'User not authenticated' }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', profile.id)
        .eq('product_id', productId)

      if (error) return { error }

      await fetchCartItems()
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (!profile) return { error: 'User not authenticated' }
      if (quantity <= 0) return { error: 'Quantity must be greater than 0' }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', profile.id)
        .eq('product_id', productId)

      if (error) return { error }

      await fetchCartItems()
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const clearCart = async () => {
    try {
      if (!profile) return { error: 'User not authenticated' }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', profile.id)

      if (error) return { error }

      setCartItems([])
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.products.price * item.quantity)
  }, 0)

  const cartCount = cartItems.reduce((total, item) => {
    return total + item.quantity
  }, 0)

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
