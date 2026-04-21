import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center p-12">
      <span className="loading loading-dots loading-lg text-primary"></span>
    </div>
  );
};

export default Spinner;