import React, { useState, useEffect } from 'react';

const DealCard = ({ deal }) => {
  const initialTimer = deal.timer || '00:00:00';
  const [timer, setTimer] = useState(() => {
    const storedTimer = localStorage.getItem(`timer_${deal._id}`);
    return storedTimer || initialTimer;
  });

  useEffect(() => {
    const [hours, minutes, seconds] = timer.split(':').map(Number);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds <= 0) return;

    const interval = setInterval(() => {
      totalSeconds -= 1;
      if (totalSeconds <= 0) {
        setTimer('00:00:00');
        localStorage.setItem(`timer_${deal._id}`, '00:00:00');
        clearInterval(interval);
        return;
      }

      const newHours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
      const newMinutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
      const newSeconds = (totalSeconds % 60).toString().padStart(2, '0');
      const newTimer = `${newHours}:${newMinutes}:${newSeconds}`;

      setTimer(newTimer);
      localStorage.setItem(`timer_${deal._id}`, newTimer);
    }, 1000);

    return () => clearInterval(interval);
  }, [deal._id, timer]);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 mb-6 lg:h-80">
      <div className="flex flex-col lg:flex-row lg:h-full">
        {/* Image Section */}
        <div className="lg:w-2/5 relative h-48 lg:h-full">
          <img 
            src={deal.image} 
            alt={deal.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              {deal.category}
            </span>
          </div>

          {/* Tags */}
          {deal.tags && deal.tags.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1 max-w-[90%]">
              {deal.tags.map((tag, index) => (
                <span key={index} className="bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-medium px-2 py-1 rounded-full shadow-sm border border-white/50">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Star Rating Badge */}
          <div className="absolute top-3 right-3">
            <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-md flex items-center space-x-1 border border-white/50">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-slate-800 text-xs font-semibold">{deal.rating}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:w-3/5 p-4 flex flex-col justify-between lg:h-full">
          <div className="flex-1">
            {/* Header */}
            <div className="mb-3">
              <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-2 line-clamp-2 leading-tight">
                {deal.title}
              </h2>
              <div className="flex items-center text-sm text-slate-600 mb-2">
                <svg className="w-4 h-4 mr-1 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{deal.location}</span>
                <span className="mx-2">•</span>
                <span>{deal.reviewsCount} Reviews</span>
              </div>
            </div>

            {/* Features List */}
            <div className="mb-3">
              <ul className="space-y-1.5">
                {deal.description.split(',').slice(0, 2).map((item, index) => (
                  <li key={index} className="flex items-start text-base text-slate-700">
                    <svg className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{item.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price and Timer Section */}
            <div className="flex flex-col sm:flex-row lg:items-end lg:justify-between gap-3 mb-4">
              {/* Price Section */}
              <div className="flex-1">
                <div className="mb-1">
                  <span className="text-slate-500 line-through text-lg">
                    LKR {deal.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl lg:text-3xl font-bold text-red-600">
                    LKR {deal.discountedPrice.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  Already purchased: <span className="font-medium text-green-600">{deal.purchasedCount}</span>
                </div>
              </div>

              {/* Timer Section */}
              <div className="text-center sm:text-right">
                <div className="mb-2">
                  <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Limited Time Offer</span>
                </div>
                <div className="flex items-center justify-center sm:justify-end space-x-1 mb-1">
                  {timer.split(':').map((part, index) => (
                    <div key={index} className="bg-gradient-to-b from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg font-mono font-bold text-xl min-w-[50px] shadow-sm border border-blue-800">
                      {part}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center sm:justify-end space-x-4 text-xs text-slate-500 font-medium">
                  <span>Hours</span>
                  <span>Minutes</span>
                  <span>Seconds</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm">
              View Details
            </button>
            <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealCard;