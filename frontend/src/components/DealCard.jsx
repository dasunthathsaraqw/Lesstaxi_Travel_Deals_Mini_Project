import React from 'react';

const DealCard = ({ deal }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition bg-white">
      <img src={deal.image} alt={deal.title} className="w-full h-48 object-cover rounded-t-lg mb-2" />
      <h3 className="text-sm text-blue-600 font-semibold">{deal.category}</h3>
      <h2 className="text-lg font-bold mb-2">{deal.title}</h2>
      <ul className="text-gray-600 mb-3 list-disc pl-5">
        {deal.description.split(',').map((item, index) => (
          <li key={index}>{item.trim()}</li>
        ))}
      </ul>
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-gray-500 line-through">LKR {deal.price.toLocaleString()}</span>
          <span className="text-red-600 font-semibold ml-2">LKR {deal.discountedPrice.toLocaleString()}</span>
        </div>
        <span className="text-sm text-gray-500">{deal.location}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">{deal.purchasedCount} purchased</span>
      </div>
      <div className="flex justify-center space-x-2 mb-2">
        {deal.timer.split(':').map((part, index) => (
          <div key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded font-bold">
            {part}
          </div>
        ))}
        <div className="flex space-x-4 text-xs text-gray-500 absolute bottom-0 right-0 pr-4 pb-2">
          <span>Hours</span>
          <span>Minutes</span>
          <span>Seconds</span>
        </div>
      </div>
      <div className="flex items-center mb-2">
        <span className="text-yellow-500">★ {deal.rating}</span>
        <span className="text-sm text-gray-500 ml-2">({deal.reviewsCount} reviews)</span>
      </div>
      <div className="text-sm text-gray-500">Tags: {deal.tags.join(', ')}</div>
      <button className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 w-full">Book Now</button>
    </div>
  );
};

export default DealCard;