// components/ComponentCustomToast.js
import React from 'react';

const ComponentCustomToast = ({ msg }) => {
  return (
    <div>
      <p className='text-success'>{msg}</p>
    </div>
  );
};

export default ComponentCustomToast;
