import React from 'react';

function PromotionSection() {
  const promotions = [
    { 
      id: 1, 
      title: 'จัดฟัน 0 บาท', 
      description: 'โปรโมชั่นพิเศษฟรีค่าเครื่องมือ รีเทนเนอร์', 
      image: '/images/ortho.jpeg',
      duration: 'จำกัด 100 เคสเท่านั้น' 
    },
    { 
      id: 2, 
      title: 'มั่นใจฟันสวยด้วยวีเนียร์', 
      description: 'วีเนียร์มีความมันวาว เหมือนกันฟันจริงไม่ติดสี เพียงซี่ละ 8,000 บาท', 
      image: '/images/veneer.jpeg',
      duration: 'จำกัด 10 เคสเท่านั้น' 
    },
  ];

  return (
    <section className="py-8 bg-white">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">โปรโมชั่นพิเศษ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col"
          >
            <div className="w-full h-48 overflow-hidden rounded-md mb-4 flex-shrink-0">
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-700">{promo.title}</h3>
              <p className="mt-2 text-gray-600 flex-1">{promo.description}</p>
              <p className="mt-2 text-sm text-gray-500">ระยะเวลา: {promo.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PromotionSection;