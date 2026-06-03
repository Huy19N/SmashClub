import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '0 VND',
    period: '/tháng',
    features: [
      'Truy cập các khung giờ giao lưu (số lượng có hạn)',
      'Truy cập diễn đàn cộng đồng cơ bản'
    ],
    buttonText: 'Tham gia Miễn Phí',
    isPopular: false
  },
  {
    name: 'Basic',
    price: '200k',
    currency: 'VND',
    period: '/tháng',
    features: [
      'Ưu tiên đặt sân (trước 48h)',
      '1 buổi tập nhóm/tháng',
      'Giảm giá 10% tại cửa hàng'
    ],
    buttonText: 'Chọn Gói Cơ Bản',
    isPopular: true
  },
  {
    name: 'Pro',
    price: '500k',
    currency: 'VND',
    period: '/tháng',
    features: [
      'Đặt sân không giới hạn (trước 1 tuần)',
      '4 buổi huấn luyện nhóm/tháng',
      'Giảm giá 20% tại cửa hàng',
      'Dịch vụ căng vợt miễn phí (1 lần/tháng)'
    ],
    buttonText: 'Chọn Gói Pro',
    isPopular: false
  }
];

export default function PremiumSection() {
  return (
    <section id="premium-section" className="relative w-full bg-[#0b0f19] py-24 z-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display drop-shadow-md">Gói Hội Viên</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Choose the perfect plan to match your passion and playing frequency. Unlock exclusive benefits and join our elite community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-[#151921] rounded-xl p-8 flex flex-col h-full transition-transform duration-300 hover:-translate-y-2
                ${plan.isPopular ? 'border-2 border-primary shadow-[0_0_30px_rgba(34,197,94,0.15)] md:scale-105 z-10' : 'border border-white/5'}
              `}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-[#052e14] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.currency && <span className="text-lg text-gray-400 ml-1">{plan.currency}</span>}
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="h-4 w-4 rounded-full border border-primary flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3} />
                      </div>
                    </div>
                    <span className="text-gray-300 text-sm leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-primary hover:bg-primary-dark text-[#052e14] font-bold py-3 px-4 rounded-lg transition-colors duration-200">
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
