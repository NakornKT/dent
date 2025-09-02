import React from 'react';

function ReviewSection() {
  const reviews = [
    { id: 1, name: 'Steve Johnson', comment: 'I visit every 6 months, excellent work, and she is a very experienced doctor!!!!', rating: 5 },
    { id: 2, name: 'Monkhana Kamlangmak', comment: 'คลินิกสวย สะอาด คุณหมอมือเบาค่ะ ช่วงนี้มีโปรเปิดร้านใหม่ด้วยดีเลิศค่ะ', rating: 4 },
    { id: 3, name: 'Eli Snow', comment: 'Excellent service and price I will be back again thank you, highly recommended', rating: 5 },
    { id: 4, name: 'Mini Angel', comment: 'คลินิกสวยยย คุณหมอใจดี บริการดีมากค่ะ', rating: 5 },
  ];

  return (
    <section className="py-8 bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">รีวิวจากผู้ใช้</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">{review.name}</h3>
            <p className="mt-2 text-gray-600">{review.comment}</p>
            <p className="mt-2 text-yellow-500">{'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ReviewSection;