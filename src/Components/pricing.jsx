import React from 'react';
import "../styles/pricing.css";

function Pricing() {

    const pricingData = [
        {
            category: 'Pooja',
            items: [
                { name: 'Ganesh Pooja', price: '₹1,500' },
                { name: 'Satyanarayan Pooja', price: '₹2,500' },
                { name: 'Navgraha Pooja', price: '₹3,000' },
            ],
        },
        {
            category: 'Membership',
            items: [
                { name: 'Silver Membership', price: '₹500/month' },
                { name: 'Gold Membership', price: '₹1,000/month' },
                { name: 'Platinum Membership', price: '₹2,000/month' },
            ],
        },
        {
            category: 'Yoga',
            items: [
                { name: 'Hatha Yoga', price: '₹800/session' },
                { name: 'Ashtanga Yoga', price: '₹1,000/session' },
                { name: 'Kundalini Yoga', price: '₹1,200/session' },
            ],
        },
        {
            category: 'Pandit Services',
            items: [
                { name: 'Wedding Ceremony', price: '₹10,000' },
                { name: 'Griha Pravesh', price: '₹5,000' },
                { name: 'Shraddha Ceremony', price: '₹3,500' },
            ],
        },
        {
            category: 'Astrology',
            items: [
                { name: 'Personal Horoscope', price: '₹2,000' },
                { name: 'Matchmaking', price: '₹1,500' },
                { name: 'Yearly Prediction', price: '₹2,500' },
            ],
        },
        {
            category: 'Temple & Prasad',
            items: [
                { name: 'Temple Entry', price: '₹500' },
                { name: 'Prasad Delivery', price: '₹300' },
                { name: 'Special Darshan', price: '₹1,000' },
            ],
        },
    ];

    return (
        <>
            <div className="pricing-page">
                <div className='container'>
                    <h1 className="pricing-title">Pricing Details</h1>
                    <div className="pricing-container">
                        {pricingData.map((category, index) => (
                            <div key={index} className="pricing-category">
                                <h2 className="category-title">{category.category}</h2>
                                <ul className="category-items">
                                    {category.items.map((item, i) => (
                                        <li key={i} className="pricing-item">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-price">{item.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Pricing;