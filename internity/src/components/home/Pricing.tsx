"use client"

import React from 'react'
import Link from 'next/link'
import { CheckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Starter',
    price: '0',
    currency: '₹',
    interval: 'per month',
    description: 'Good for individuals who are just starting out, and want to get familiar with the platform.',
    features: [
      '3 Domain Resume downloads per month',
      '3 Job based Resume downloads per month',
      'Limited AI contribution generation',
      'Limited AI Skills extractions',
      'Personalized job recommendations'
    ],
    cta: 'Get Started for free',
    href: 'https://app.applyasyougo.in/',
  },
  {
    name: 'Pro',
    price: '149',
    currency: '₹',
    interval: 'per month',
    description: 'Highly recommended for jobseekers who want to automate their job search journey.',
    features: [
      'Unlimited Domain Resume downloads',
      'Unlimited Job based Resume downloads',
      'Unlimited AI contribution generation',
      'Unlimited AI Skills extractions',
      'Coming Soon:',
      'Advanced career dashboard',
      'Cover letter generation',
      'Browser extension for seamless applications'
    ],
    cta: 'Start with Pro',
    href: 'https://app.applyasyougo.in/?subscriptionPlan=pro',
    popular: true,
  }
]

const Pricing = () => {
  return (
    <section className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-purple-900/10 to-transparent z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharge your job search and be a pro</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Upgrade to unlock Apply As You Go's unlimited access and make your job search effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border ${plan.popular ? 'border-purple-600 bg-purple-900/10' : 'border-gray-800 bg-gray-900/10'} p-8 relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    RECOMMENDED
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">{plan.currency}{plan.price}</span>
                  <span className="text-gray-400 ml-1">{plan.interval}</span>
                </div>
                <p className="text-gray-400 mt-3 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className={`flex items-start ${feature.startsWith('Coming Soon:') ? 'text-purple-400 font-semibold mt-4' : ''}`}>
                    {!feature.startsWith('Coming Soon:') && (
                      <CheckIcon className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.startsWith('Coming Soon:') ? '' : 'text-gray-300'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className={`w-full ${plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 neon-glow'
                    : 'bg-transparent border border-gray-700 hover:bg-gray-800 text-white'} rounded-full`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
