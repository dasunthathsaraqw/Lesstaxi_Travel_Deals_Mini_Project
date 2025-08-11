// frontend/src/pages/Home.js
import React, { useEffect, useState } from 'react';
import DealCard from '../components/DealCard';
import { fetchDeals } from '../services/api';

const Home = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dealsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getDeals = async () => {
      try {
        const data = await fetchDeals();
        setDeals(data);
        setFilteredDeals(data);
      } catch (err) {
        console.error('Error fetching deals:', err);
      } finally {
        setLoading(false);
      }
    };
    getDeals();
  }, []);

  useEffect(() => {
    let filtered = deals;
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(lowerTerm) ||
        deal.description.toLowerCase().includes(lowerTerm) ||
        deal.location.toLowerCase().includes(lowerTerm) ||
        deal.tags.some(tag => tag.toLowerCase().includes(lowerTerm)) ||
        deal.category.toLowerCase().includes(lowerTerm)
      );
    }
    setFilteredDeals(filtered);
    setCurrentPage(1);
  }, [searchTerm, deals]);

  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = filteredDeals.slice(indexOfFirstDeal, indexOfLastDeal);
  const totalPages = Math.ceil(filteredDeals.length / dealsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Travel Deals in Sri Lanka</h1>
      <div className="relative w-full max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search deals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">Loading deals...</p>
      ) : filteredDeals.length === 0 ? (
        <p className="text-center text-gray-500">No deals found. Try adjusting your search.</p>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {currentDeals.map((deal) => (
              <DealCard key={deal._id} deal={deal} />
            ))}
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 hover:bg-blue-600 transition"
            >
              Previous
            </button>
            <span className="self-center font-medium">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 hover:bg-blue-600 transition"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;