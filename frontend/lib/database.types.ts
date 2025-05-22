export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          email?: string | null
          created_at?: string
        }
      }
      entries: {
        Row: {
          id: string
          customer_id: string
          date: string
          product: string
          quantity: number
          price_per_unit: number
          amount: number
          is_paid: boolean
          paid_on: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          date: string
          product: string
          quantity: number
          price_per_unit: number
          amount: number
          is_paid?: boolean
          paid_on?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          date?: string
          product?: string
          quantity?: number
          price_per_unit?: number
          amount?: number
          is_paid?: boolean
          paid_on?: string | null
          created_at?: string
        }
      }
      bills: {
        Row: {
          id: string
          customer_id: string
          month: number
          year: number
          total_amount: number
          is_paid: boolean
          paid_on: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          month: number
          year: number
          total_amount: number
          is_paid?: boolean
          paid_on?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          month?: number
          year?: number
          total_amount?: number
          is_paid?: boolean
          paid_on?: string | null
          created_at?: string
        }
      }
    }
  }
}