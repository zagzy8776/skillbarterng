'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

interface P2PListing {
  id: string
  type: 'crypto' | 'gift-cards'
  trade_type: 'buy' | 'sell'
  asset: string
  crypto_symbol?: string
  gift_card_type?: string
  amount: number
  price_per_unit: number
  total_price: number
  payment_methods: string[]
  conditions?: string
  seller_id: string
  seller_name?: string
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
  escrow_status: 'none' | 'pending' | 'locked' | 'released'
}

export default function P2PSection() {
  const [listings, setListings] = useState<P2PListing[]>([])
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'crypto' | 'gift-cards'>('crypto')
  const router = useRouter()

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  useEffect(() => {
    loadUser()
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-64 mx-auto mb-8"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                    <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Mobile-Optimized Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            💱 P2P Marketplace
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Buy and sell securely with escrow protection
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xl">🔒</div>
            <h3 className="text-base font-semibold text-green-800 dark:text-green-200">Secure Escrow Protection</h3>
          </div>
          <p className="text-green-700 dark:text-green-300 text-sm">
            All transactions protected by our escrow system
          </p>
        </div>

        {/* Big Touch-Friendly Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm w-full max-w-md">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('crypto')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition text-sm sm:text-base ${
                  activeTab === 'crypto'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                🪙 Crypto
              </button>
              <button
                onClick={() => setActiveTab('gift-cards')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition text-sm sm:text-base ${
                  activeTab === 'gift-cards'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                🎁 Gift Cards
              </button>
            </div>
          </div>
        </div>

        {/* Big Touch Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={() => {
              if (!user) {
                router.push('/login');
              } else {
                alert('Create listing feature coming soon!');
              }
            }}
            className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl text-lg"
          >
            ➕ Create Listing
          </button>
          <button
            onClick={() => {
              alert('Buy/Sell mode toggle coming soon!');
            }}
            className="px-6 py-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-semibold rounded-xl transition text-lg"
          >
            📈 Trade Mode
          </button>
        </div>

        {/* Mobile-Optimized Listings */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
            Available {activeTab === 'crypto' ? 'Crypto' : 'Gift Card'} Listings (0)
          </h2>

          <div className="text-center py-12">
            <div className="text-4xl mb-4">{activeTab === 'crypto' ? '🪙' : '🎁'}</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No listings yet</h3>
            <p className="text-slate-600 dark:text-slate-300">Be the first to create a listing!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
