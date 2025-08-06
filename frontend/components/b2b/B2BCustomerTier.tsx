'use client';

import { useState, useEffect } from 'react';
import { 
  Crown, 
  Star, 
  Award, 
  TrendingUp, 
  ShoppingBag, 
  Target,
  Gift,
  Percent,
  Euro,
  ChevronRight,
  Lock,
  Unlock
} from 'lucide-react';

interface CustomerTier {
  id: string;
  name: string;
  level: number;
  discountPercentage: number;
  minimumOrderValue: number;
  minimumAnnualSpend: number;
  benefits: string[];
  color: string;
  icon: React.ReactNode;
}

interface CustomerStats {
  currentTierId: string;
  currentSpend: number;
  annualSpend: number;
  ordersCount: number;
  totalSavings: number;
  nextTierProgress: number;
  nextTierRequirement: number;
}

export default function B2BCustomerTier() {
  const [tiers, setTiers] = useState<CustomerTier[]>([]);
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<CustomerTier | null>(null);

  useEffect(() => {
    fetchTiersAndStats();
  }, []);

  const fetchTiersAndStats = async () => {
    try {
      // Mock data for now - replace with actual API calls
      const mockTiers: CustomerTier[] = [
        {
          id: '1',
          name: 'Bronze',
          level: 1,
          discountPercentage: 5,
          minimumOrderValue: 100,
          minimumAnnualSpend: 0,
          benefits: [
            '5% discount on bulk orders',
            'Standard shipping rates',
            'Email support',
            'Monthly product catalogs'
          ],
          color: 'amber',
          icon: <Award className="h-6 w-6" />
        },
        {
          id: '2',
          name: 'Silver',
          level: 2,
          discountPercentage: 10,
          minimumOrderValue: 250,
          minimumAnnualSpend: 5000,
          benefits: [
            '10% discount on bulk orders',
            'Free standard shipping',
            'Priority email support',
            'Quarterly business reviews',
            'Early access to new products'
          ],
          color: 'gray',
          icon: <Star className="h-6 w-6" />
        },
        {
          id: '3',
          name: 'Gold',
          level: 3,
          discountPercentage: 15,
          minimumOrderValue: 500,
          minimumAnnualSpend: 15000,
          benefits: [
            '15% discount on bulk orders',
            'Free express shipping',
            'Dedicated account manager',
            'Monthly business reviews',
            'Exclusive product previews',
            'Custom payment terms',
            'Volume-based pricing'
          ],
          color: 'yellow',
          icon: <Crown className="h-6 w-6" />
        },
        {
          id: '4',
          name: 'Platinum',
          level: 4,
          discountPercentage: 20,
          minimumOrderValue: 1000,
          minimumAnnualSpend: 50000,
          benefits: [
            '20% discount on bulk orders',
            'Free overnight shipping',
            'Personal account manager',
            'Weekly business reviews',
            'Product customization options',
            'Extended payment terms',
            'White-label opportunities',
            'Training and certification programs'
          ],
          color: 'purple',
          icon: <Crown className="h-6 w-6" />
        }
      ];

      const mockStats: CustomerStats = {
        currentTierId: '2',
        currentSpend: 8750,
        annualSpend: 8750,
        ordersCount: 12,
        totalSavings: 875,
        nextTierProgress: 58, // 8750 / 15000 * 100
        nextTierRequirement: 15000
      };

      setTiers(mockTiers);
      setCustomerStats(mockStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tier data:', error);
      setLoading(false);
    }
  };

  const getCurrentTier = () => {
    if (!customerStats) return null;
    return tiers.find(tier => tier.id === customerStats.currentTierId);
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    if (!currentTier) return null;
    return tiers.find(tier => tier.level === currentTier.level + 1);
  };

  const getTierColorClasses = (color: string, variant: 'bg' | 'text' | 'border') => {
    const colorMap = {
      amber: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-200'
      },
      gray: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200'
      },
      yellow: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200'
      }
    };
    return colorMap[color as keyof typeof colorMap]?.[variant] || 'bg-gray-100';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Tier Program</h1>
        <p className="text-gray-600">Unlock exclusive benefits and savings with higher tiers</p>
      </div>

      {/* Current Status Card */}
      {currentTier && customerStats && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${getTierColorClasses(currentTier.color, 'bg')}`}>
                {currentTier.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentTier.name} Tier
                </h2>
                <p className="text-gray-600">
                  You're saving {currentTier.discountPercentage}% on bulk orders
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Savings This Year</p>
              <p className="text-2xl font-bold text-green-600">
                €{customerStats.totalSavings.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center space-x-2 mb-2">
                <Euro className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Annual Spend</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                €{customerStats.annualSpend.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingBag className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Orders Placed</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {customerStats.ordersCount}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center space-x-2 mb-2">
                <Percent className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Current Discount</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {currentTier.discountPercentage}%
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">Next Tier</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {nextTier ? `${customerStats.nextTierProgress}%` : 'Max Level'}
              </p>
            </div>
          </div>

          {/* Progress to Next Tier */}
          {nextTier && (
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Progress to {nextTier.name} Tier
                </span>
                <span className="text-sm text-gray-500">
                  €{customerStats.annualSpend.toLocaleString()} / €{customerStats.nextTierRequirement.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${customerStats.nextTierProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Spend €{(customerStats.nextTierRequirement - customerStats.annualSpend).toLocaleString()} more to unlock {nextTier.name} benefits
              </p>
            </div>
          )}
        </div>
      )}

      {/* All Tiers Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Tier Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const isCurrentTier = customerStats?.currentTierId === tier.id;
            const isLocked = customerStats ? customerStats.annualSpend < tier.minimumAnnualSpend : true;
            
            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isCurrentTier 
                    ? `${getTierColorClasses(tier.color, 'border')} shadow-lg` 
                    : 'border-gray-200'
                } ${isLocked ? 'opacity-75' : ''}`}
                onClick={() => setSelectedTier(tier)}
              >
                {isCurrentTier && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getTierColorClasses(tier.color, 'bg')} ${getTierColorClasses(tier.color, 'text')}`}>
                      CURRENT
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getTierColorClasses(tier.color, 'bg')}`}>
                    {tier.icon}
                  </div>
                  <div className="text-right">
                    {isLocked ? (
                      <Lock className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Unlock className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Discount</span>
                    <span className="font-bold text-green-600">{tier.discountPercentage}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Min Order</span>
                    <span className="font-medium">€{tier.minimumOrderValue}</span>
                  </div>
                  
                  {tier.minimumAnnualSpend > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Annual Req.</span>
                      <span className="font-medium">€{tier.minimumAnnualSpend.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 mb-4">
                  {tier.benefits.slice(0, 3).map((benefit, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {benefit}
                    </div>
                  ))}
                  {tier.benefits.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{tier.benefits.length - 3} more benefits
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTier(tier);
                  }}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits Comparison */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tier Benefits Comparison</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Benefit</th>
                {tiers.map((tier) => (
                  <th key={tier.id} className="text-center py-3 px-4 font-medium text-gray-900">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                'Bulk order discount',
                'Free shipping',
                'Account manager',
                'Business reviews',
                'Early access',
                'Custom terms',
                'Training programs'
              ].map((benefit, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 text-sm text-gray-900">{benefit}</td>
                  {tiers.map((tier) => {
                    const hasBenefit = tier.benefits.some(b => 
                      b.toLowerCase().includes(benefit.toLowerCase().split(' ')[0])
                    );
                    return (
                      <td key={tier.id} className="text-center py-3 px-4">
                        {hasBenefit ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6">
                            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier Detail Modal */}
      {selectedTier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-xl ${getTierColorClasses(selectedTier.color, 'bg')}`}>
                    {selectedTier.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedTier.name} Tier
                    </h2>
                    <p className="text-gray-600">Level {selectedTier.level}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTier(null)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Close"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Percent className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Discount Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedTier.discountPercentage}%
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Minimum Order</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    €{selectedTier.minimumOrderValue}
                  </p>
                </div>
                
                {selectedTier.minimumAnnualSpend > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900">Annual Spend Requirement</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      €{selectedTier.minimumAnnualSpend.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  <Gift className="h-5 w-5 inline mr-2" />
                  Tier Benefits
                </h3>
                <div className="space-y-3">
                  {selectedTier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {customerStats && customerStats.currentTierId !== selectedTier.id && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    How to reach {selectedTier.name} tier:
                  </h4>
                  <p className="text-blue-800 text-sm">
                    {selectedTier.minimumAnnualSpend > customerStats.annualSpend ? (
                      <>
                        Spend €{(selectedTier.minimumAnnualSpend - customerStats.annualSpend).toLocaleString()} more this year to unlock {selectedTier.name} benefits.
                      </>
                    ) : (
                      <>
                        You've already met the spending requirement! Your tier will be updated in the next billing cycle.
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
