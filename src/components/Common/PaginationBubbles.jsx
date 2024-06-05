// components/Common/PaginationBubbles.js
import React from 'react';

const PaginationBubbles = ({ sections, activeSection }) => {
  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`w-3 h-3 mb-2 rounded-full cursor-pointer border-grean border ${
            activeSection === index ? 'bg-grean' : 'bg-light-gray '
          }`}
          onClick={() => section.scrollIntoView({ behavior: 'smooth' })}
        />
      ))}
    </div>
  );
};

export default PaginationBubbles;

