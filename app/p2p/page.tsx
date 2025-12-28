'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface P2PListing {
  id: string
  type: 'crypto' | 'gift-cards'
  trade_type: 'buy' | 'sell',
  asset: string,
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

interface Trade {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  amount: number
  price_per_unit: number
  status: 'pending' | 'escrow' | 'completed' | 'disputed'
  escrow_funds: number
  created_at: string
  completed_at?: string
}

export default function P2PPage() {
  const [listings, setListings] = useState<P2PListing[]>([])
  const [filteredListings, setFilteredListings] = useState<P2PListing[]>([])
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'crypto' | 'gift-cards'>('crypto')
  const [tradeType, setTradeType] = useState<'buy' | 'sell' | 'all'>('all')
  const [cryptoFilter, setCryptoFilter] = useState('all')
  const [giftCardFilter, setGiftCardFilter] = useState('all')
  const [showCreateListing, setShowCreateListing] = useState(false)
  const [userTrades, setUserTrades] = useState<Trade[]>([])
  const router = useRouter()

  useEffect(() => {
    loadListings()
    loadUser()
  }, [])

  useEffect(() => {
    filterListings()
  }, [listings, activeTab, tradeType, cryptoFilter, giftCardFilter])

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('p2p_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      setListings(data || [])
    } catch (error) {
      console.error('Error loading listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Load user's trades
        const { data: trades } = await supabase
          .from('p2p_trades')
          .select('*')
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('created_at', { ascending: false })

        setUserTrades(trades || [])
      }
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  const filterListings = () => {
    let filtered = listings.filter(listing => listing.type === activeTab)

    if (tradeType !== 'all') {
      filtered = filtered.filter(listing => listing.trade_type === tradeType)
    }

    if (activeTab === 'crypto' && cryptoFilter !== 'all') {
      filtered = filtered.filter(listing => listing.crypto_symbol === cryptoFilter)
    }

    if (activeTab === 'gift-cards' && giftCardFilter !== 'all') {
      filtered = filtered.filter(listing => listing.gift_card_type === giftCardFilter)
    }

    setFilteredListings(filtered)
  }

  const initiateTrade = async (listingId: string) => {
    if (!user) {
      router.push('/login')
      return
    }

    const listing = listings.find(l => l.id === listingId)
    if (!listing) return

    // Check if user is trying to trade with themselves
    if (listing.seller_id === user.id) {
      alert('You cannot trade with yourself!')
      return
    }

    try {
      // Create trade in escrow
      const { error } = await supabase
        .from('p2p_trades')
        .insert({
          listing_id: listingId,
          buyer_id: listing.trade_type === 'sell' ? user.id : listing.seller_id,
          seller_id: listing.trade_type === 'sell' ? listing.seller_id : user.id,
          amount: listing.amount,
          price_per_unit: listing.price_per_unit,
          status: 'escrow',
          escrow_funds: listing.total_price
        })

      if (error) throw error

      alert('Trade initiated! Funds are now in escrow. Complete the payment to release funds to seller.')
      loadListings()
      loadUser()
    } catch (error: any) {
      alert('Error initiating trade: ' + error.message)
    }
  }

  const releaseEscrow = async (tradeId: string) => {
    try {
      const { error } = await supabase
        .from('p2p_trades')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', tradeId)
      .eq('buyer_id', user!.id) // Only buyer can release

      if (error) throw error

      alert('Escrow released! Funds sent to seller.')
      loadUser()
    } catch (error: any) {
      alert('Error releasing escrow: ' + error.message)
    }
  }

  const disputeTrade = async (tradeId: string) => {
    try {
      const { error } = await supabase
        .from('p2p_trades')
        .update({
          status: 'disputed'
        })
        .eq('id', tradeId)

      if (error) throw error

      alert('Trade disputed! Admin will review and resolve.')
      loadUser()
    } catch (error: any) {
      alert('Error disputing trade: ' + error.message)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-64 mx-auto mb-8"></div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
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
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">
              🔄 P2P Marketplace
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto px-4">
              Buy and sell cryptocurrencies and gift cards securely with escrow protection. Safe, fast, and trusted by students across Nigeria.
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="text-xl sm:text-2xl">🔒</div>
              <h3 className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-200">Secure Escrow Protection</h3>
            </div>
            <p className="text-green-700 dark:text-green-300 text-xs sm:text-sm">
              All transactions are protected by our escrow system. Funds are held securely until both parties confirm the trade is complete.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-1 sm:p-2 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => setActiveTab('crypto')}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base ${
                    activeTab === 'crypto'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  🪙 Crypto
                </button>
                <button
                  onClick={() => setActiveTab('gift-cards')}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base ${
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
            <button
              onClick={() => {
                if (!user) {
                  router.push('/login');
                } else {
                  setShowCreateListing(!showCreateListing);
                }
              }}
              className="px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              ➕ Create Listing
            </button>
            <Link
              href="/dashboard"
              className="px-6 sm:px-8 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-semibold rounded-xl transition text-sm sm:text-base text-center"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* My Trades Section */}
          {userTrades.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">My Active Trades</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {userTrades.filter(trade => trade.status !== 'completed').map((trade) => (
                  <div key={trade.id} className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 sm:p-6 border border-orange-200 dark:border-orange-800 shadow-sm">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                          Trade #{trade.id.slice(-8)}
                        </h3>
                        <p className="text-orange-600 dark:text-orange-400 font-medium text-sm">
                          ₦{trade.escrow_funds.toLocaleString()} in escrow
                        </p>
                      </div>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        trade.status === 'escrow' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                        trade.status === 'disputed' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {trade.status}
                      </span>
                    </div>

                    <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Amount: {trade.amount} units
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Price: ₦{trade.price_per_unit.toLocaleString()} each
                      </p>
                    </div>

                    {trade.status === 'escrow' && user && trade.buyer_id === user.id && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => releaseEscrow(trade.id)}
                          className="flex-1 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition text-sm"
                        >
                          ✅ Release
                        </button>
                        <button
                          onClick={() => disputeTrade(trade.id)}
                          className="flex-1 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition text-sm"
                        >
                          ⚠️ Dispute
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trade Type Toggle */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex">
              <button
                onClick={() => setTradeType('buy')}
                className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition text-sm sm:text-base ${
                  tradeType === 'buy' ? "bg-green-500 text-white" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Buy 📈
              </button>
              <button
                onClick={() => setTradeType('sell')}
                className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition text-sm sm:text-base ${
                  tradeType === 'sell' ? "bg-red-500 text-white" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Sell 📉
              </button>
            </div>
          </div>

          {/* Create Listing Form */}
          {showCreateListing && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 border border-slate-200 dark:border-slate-700 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Create New Listing</h2>
              <CreateListingForm
                activeTab={activeTab}
                onListingCreated={() => {
                  setShowCreateListing(false)
                  loadListings()
                }}
              />
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {activeTab === 'crypto' ? '🪙 Cryptocurrency' : '🎁 Gift Card Type'}
                </label>
                {activeTab === 'crypto' ? (
                  <select
                    value={cryptoFilter}
                    onChange={(e) => setCryptoFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Cryptos</option>
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                    <option value="USDC">USD Coin (USDC)</option>
                    <option value="BNB">Binance Coin (BNB)</option>
                    <option value="SOL">Solana (SOL)</option>
                    <option value="ADA">Cardano (ADA)</option>
                  </select>
                ) : (
                  <select
                    value={giftCardFilter}
                    onChange={(e) => setGiftCardFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Gift Cards</option>
                    <option value="amazon">Amazon</option>
                    <option value="google-play">Google Play</option>
                    <option value="apple">Apple/iTunes</option>
                    <option value="steam">Steam</option>
                    <option value="netflix">Netflix</option>
                    <option value="spotify">Spotify</option>
                    <option value="visa">Visa Prepaid</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">📍 Payment Methods</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Bank Transfer</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Mobile Money</span>
                  </label>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setCryptoFilter('all')
                    setGiftCardFilter('all')
                  }}
                  className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-900 dark:text-slate-100 rounded-lg transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Available {activeTab === 'crypto' ? 'Crypto' : 'Gift Card'} Listings ({filteredListings.length})
            </h2>

            {filteredListings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">{activeTab === 'crypto' ? '🪙' : '🎁'}</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No listings found</h3>
                <p className="text-slate-600 dark:text-slate-300">Be the first to create a listing for this category!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            listing.trade_type === 'buy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {listing.trade_type.toUpperCase()}
                          </span>
                          <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg">
                            {activeTab === 'crypto' ? listing.crypto_symbol : listing.gift_card_type}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {listing.trade_type === 'buy' ? 'Buying' : 'Selling'} {listing.amount} {activeTab === 'crypto' ? listing.crypto_symbol : listing.gift_card_type}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                          ₦{listing.price_per_unit.toLocaleString()} per unit
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-300">Total Amount:</span>
                        <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                          ₦{listing.total_price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Payment Methods:</p>
                      <div className="flex flex-wrap gap-2">
                        {listing.payment_methods.map((method, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <span>By {listing.seller_name || 'Anonymous'}</span>
                      <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                    </div>

                    <button
                      onClick={() => initiateTrade(listing.id)}
                      disabled={listing.seller_id === user?.id}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                    >
                      {listing.seller_id === user?.id ? 'Your Listing' : '🔒 Start Trade (Escrow)'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Create Listing Form Component
function CreateListingForm({ activeTab, onListingCreated }: { activeTab: 'crypto' | 'gift-cards'; onListingCreated: () => void }) {
  const [formData, setFormData] = useState({
    trade_type: 'sell' as 'buy' | 'sell',
    crypto_symbol: '',
    gift_card_type: '',
    amount: 0,
    price_per_unit: 0,
    payment_methods: [] as string[],
    conditions: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const total_price = formData.amount * formData.price_per_unit
      const asset = activeTab === 'crypto' ? formData.crypto_symbol : formData.gift_card_type;

      const { error } = await supabase
        .from('p2p_listings')
        .insert({
          type: activeTab === 'crypto' ? 'crypto' : 'gift-cards',
          trade_type: formData.trade_type,
          asset: asset,
          crypto_symbol: activeTab === 'crypto' ? formData.crypto_symbol : null,
          gift_card_type: activeTab === 'gift-cards' ? formData.gift_card_type : null,
          amount: formData.amount,
          price_per_unit: formData.price_per_unit,
          total_price,
          payment_methods: formData.payment_methods,
          conditions: formData.conditions,
          seller_id: user.id,
          status: 'active'
        })

      if (error) throw error

      alert('Listing created successfully!')
      onListingCreated()
    } catch (error: any) {
      alert('Error creating listing: ' + error.message)
    }
  }

  const togglePaymentMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      payment_methods: prev.payment_methods.includes(method)
        ? prev.payment_methods.filter(m => m !== method)
        : [...prev.payment_methods, method]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Trade Type</label>
          <select
            value={formData.trade_type}
            onChange={(e) => setFormData(prev => ({ ...prev, trade_type: e.target.value as 'buy' | 'sell' }))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="sell">I want to SELL</option>
            <option value="buy">I want to BUY</option>
          </select>
        </div>

        {activeTab === 'crypto' ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cryptocurrency</label>
            <select
              value={formData.crypto_symbol}
              onChange={(e) => setFormData(prev => ({ ...prev, crypto_symbol: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Crypto</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="USDC">USD Coin (USDC)</option>
              <option value="BNB">Binance Coin (BNB)</option>
              <option value="SOL">Solana (SOL)</option>
              <option value="ADA">Cardano (ADA)</option>
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gift Card Type</label>
            <select
              value={formData.gift_card_type}
              onChange={(e) => setFormData(prev => ({ ...prev, gift_card_type: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Gift Card</option>
              <option value="amazon">Amazon</option>
              <option value="google-play">Google Play</option>
              <option value="apple">Apple/iTunes</option>
              <option value="steam">Steam</option>
              <option value="netflix">Netflix</option>
              <option value="spotify">Spotify</option>
              <option value="visa">Visa Prepaid</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Amount ({activeTab === 'crypto' ? 'Units' : 'Value in ₦'})
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
            placeholder={activeTab === 'crypto' ? '0.01' : '5000'}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Price per Unit (₦)
          </label>
          <input
            type="number"
            min="0"
            value={formData.price_per_unit}
            onChange={(e) => setFormData(prev => ({ ...prev, price_per_unit: Number(e.target.value) }))}
            placeholder="750000"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {formData.amount > 0 && formData.price_per_unit > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-indigo-700 dark:text-indigo-300">Total Value:</span>
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              ₦{(formData.amount * formData.price_per_unit).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Payment Methods Accepted</label>
        <div className="grid md:grid-cols-2 gap-3">
          {['Bank Transfer', 'Mobile Money', 'Cash App', 'PayPal', 'Crypto Wallet', 'Western Union'].map((method) => (
            <label key={method} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.payment_methods.includes(method)}
                onChange={() => togglePaymentMethod(method)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 rounded"
              />
              <span className="text-slate-700 dark:text-slate-300">{method}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Additional Conditions (Optional)</label>
        <textarea
          rows={3}
          value={formData.conditions}
          onChange={(e) => setFormData(prev => ({ ...prev, conditions: e.target.value }))}
          placeholder="Any special conditions or requirements for this trade..."
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
        >
          📝 Create Listing
        </button>
      </div>
    </form>
  )
}
