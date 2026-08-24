import React, { useState } from 'react';

const PoojaDetailBalancedView = ({ poojaData, onBookNow }) => {
  const [selectedPackage, setSelectedPackage] = useState(
    poojaData?.packages?.[0] || null
  );
  const [selectedPanditId, setSelectedPanditId] = useState(
    poojaData?.pandits?.[0]?.id || null
  );
  const [activeTab, setActiveTab] = useState('samagri'); // 'samagri' | 'benefits' | 'process'

  const currentPrice = selectedPackage ? selectedPackage.price : (poojaData?.final_price || poojaData?.price || 1100);

  const handleBooking = () => {
    if (onBookNow) {
      onBookNow({
        package: selectedPackage,
        panditId: selectedPanditId,
        amount: currentPrice,
      });
    } else {
      alert(`Proceeding with ${selectedPackage?.name || 'Pooja'} at Rs.${currentPrice} with Pandit ID #${selectedPanditId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      
      {/* ---------------- 1. TOP SECTION: PACKAGES ---------------- */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Select Pooja Package</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {poojaData?.packages?.map((pkg) => {
            const isSelected = selectedPackage?.id === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/40 shadow-lg ring-2 ring-orange-300 transform -translate-y-1'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800 text-sm">{pkg.name}</h3>
                  <input
                    type="radio"
                    name="pooja_pkg"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 text-orange-600 cursor-pointer"
                  />
                </div>
                <div className="mt-3 text-2xl font-black text-orange-600">
                  Rs.{pkg.price}
                </div>
                <p className="text-xs text-gray-500 mt-2 min-h-[36px]">{pkg.description}</p>
                
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 text-[11px] text-gray-600">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">👥 {pkg.members_allowed || 1} Devotee</span>
                  <span className="bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded">🕉️ {pkg.pandit_count || 1} Pandit</span>
                  {pkg.prasad_included !== false && (
                    <span className="bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded">📦 Prasad</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- 2. FULL-WIDTH PANDITS SECTION (No Blank Space) ---------------- */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6 pb-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>🕉️</span> Assigned Vedic Pandits
              <span className="text-xs bg-orange-100 text-orange-800 font-extrabold px-3 py-1 rounded-full">
                {poojaData?.pandits?.length || 0} Available
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Select your preferred certified Vedic Acharya to perform this sacred ritual
            </p>
          </div>
        </div>

        {/* 4 Columns Grid for Pandits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {poojaData?.pandits?.map((pandit) => {
            const isSelected = selectedPanditId === pandit.id;
            return (
              <div
                key={pandit.id}
                onClick={() => setSelectedPanditId(pandit.id)}
                className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/70 shadow-md ring-2 ring-orange-200'
                    : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                }`}
              >
                <img
                  src={pandit.profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                  alt={pandit.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-orange-200 mr-3 flex-shrink-0 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {pandit.name} {pandit.lastname || ''}
                    </h4>
                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                      ✓ Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                    {pandit.experience ? `${pandit.experience} Yrs Exp` : '10+ Yrs Exp'} • {pandit.gotra || 'Vedic'}
                  </p>
                  <p className="text-[11px] text-orange-600 font-semibold mt-1 truncate">
                    {pandit.skills || 'Vedic Chanting & Anushthan'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- 3. TABBED INFO SECTION: SAMAGRI, BENEFITS, PROCESS ---------------- */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        {/* Tabs navigation */}
        <div className="flex gap-4 border-b pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('samagri')}
            className={`pb-2 font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'samagri'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🪔 About Pooja Samagri
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`pb-2 font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'benefits'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            ✨ Pooja Benefits
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`pb-2 font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'process'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            📖 How it Happens
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-4 text-sm text-gray-700 leading-relaxed">
          {activeTab === 'samagri' && (
            <div>
              <p>{poojaData?.about_samagri || 'Pure desi ghee, Gangajal, Roli, Akshat, Dhoop, Supari, Janeu, Kalash samagri included.'}</p>
            </div>
          )}
          {activeTab === 'benefits' && (
            <div>
              <p>{poojaData?.benefits || 'Brings peace, prosperity, removes planetary doshas and blesses family with health.'}</p>
            </div>
          )}
          {activeTab === 'process' && (
            <div>
              <p>{poojaData?.how_it_happens || 'Live Sankalp via video call by verified pandits at the auspicious muhurat.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- 4. BOTTOM FLOATING / FIXED ACTION BAR ---------------- */}
      <div className="sticky bottom-4 z-20 bg-gray-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-2xl border border-gray-700">
        <div>
          <span className="text-xs text-gray-400 uppercase font-semibold">Total Amount for Selected Package</span>
          <div className="text-3xl font-black text-orange-400">
            Rs. {currentPrice}
          </div>
          <span className="text-xs text-gray-300">
            Selected: <b className="text-white">{selectedPackage?.name}</b> • Pandit ID: <b className="text-orange-300">#{selectedPanditId}</b>
          </span>
        </div>
        <button
          onClick={handleBooking}
          className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition transform active:scale-95"
        >
          Book Pooja Now (Rs. {currentPrice})
        </button>
      </div>
    </div>
  );
};

export default PoojaDetailBalancedView;
