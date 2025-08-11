import React, { useEffect, useState } from 'react';
import DealCard from '../components/DealCard';
import { fetchDeals } from '../services/api';

const Home = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dealsPerPage] = useState(6); // 6 deals per page
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterTag, setFilterTag] = useState('');

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
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterLocation) {
      filtered = filtered.filter(deal => deal.location.toLowerCase() === filterLocation.toLowerCase());
    }
    if (filterTag) {
      filtered = filtered.filter(deal => deal.tags.some(tag => tag.toLowerCase() === filterTag.toLowerCase()));
    }
    setFilteredDeals(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterLocation, filterTag, deals]);

  // Pagination logic
  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = filteredDeals.slice(indexOfFirstDeal, indexOfLastDeal);
  const totalPages = Math.ceil(filteredDeals.length / dealsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Travel Deals in Sri Lanka</h1>
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Filter by location (e.g., Kandy)..."
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Filter by tag (e.g., luxury)..."
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading deals...</p>
      ) : filteredDeals.length === 0 ? (
        <p className="text-center text-gray-500">No deals found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDeals.map((deal) => (
              <DealCard key={deal._id} deal={deal} />
            ))}
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="self-center">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
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