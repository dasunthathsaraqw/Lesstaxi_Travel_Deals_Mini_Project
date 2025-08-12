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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);

  // Get unique categories
  const categories = [...new Set(deals.map(deal => deal.category))];

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

    // Filter by search term
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

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(deal => deal.category === selectedCategory);
    }

    // Sort deals
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.purchasedCount - a.purchasedCount);
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    setFilteredDeals(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, deals]);

  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = filteredDeals.slice(indexOfFirstDeal, indexOfLastDeal);
  const totalPages = Math.ceil(filteredDeals.length / dealsPerPage);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('featured');
    setShowCategoryFilter(false);
    setShowSortFilter(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Best Travel Deals in Sri Lanka
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-blue-100">
            Discover amazing experiences at unbeatable prices
          </p>
          <div className="text-lg">
            <span className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            Limited Time Offers - Book Now!
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Compact Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search destinations, hotels, experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-500"
              />
            </div>

            {/* Filter Icons */}
            <div className="flex items-center space-x-2">
              {/* Category Filter Icon */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCategoryFilter(!showCategoryFilter);
                    setShowSortFilter(false);
                  }}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    selectedCategory ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title="Filter by category"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                </button>

                {/* Category Dropdown */}
                {showCategoryFilter && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSelectedCategory('');
                          setShowCategoryFilter(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          !selectedCategory ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCategoryFilter(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            selectedCategory === category ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Filter Icon */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSortFilter(!showSortFilter);
                    setShowCategoryFilter(false);
                  }}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    sortBy !== 'featured' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title="Sort deals"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </button>

                {/* Sort Dropdown */}
                {showSortFilter && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      {[
                        { value: 'featured', label: 'Featured' },
                        { value: 'price-low', label: 'Price: Low to High' },
                        { value: 'price-high', label: 'Price: High to Low' },
                        { value: 'rating', label: 'Highest Rated' },
                        { value: 'popular', label: 'Most Popular' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortFilter(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            sortBy === option.value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clear All Button */}
              {(searchTerm || selectedCategory || sortBy !== 'featured') && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors border border-gray-200 rounded-lg hover:border-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 pt-3 border-t border-gray-100 text-gray-600">
            <span className="text-sm">
              {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory && ` in ${selectedCategory}`}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 text-lg">Finding amazing deals for you...</span>
            </div>
          </div>
        ) : filteredDeals.length === 0 ? (
          /* No Results State */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or explore different categories
            </p>
            <button
              onClick={resetFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View All Deals
            </button>
          </div>
        ) : (
          /* Deals Grid */
          <>
            <div className="space-y-8">
              {currentDeals.map((deal) => (
                <DealCard key={deal._id} deal={deal} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-12 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-600 mb-4 sm:mb-0">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Previous
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

