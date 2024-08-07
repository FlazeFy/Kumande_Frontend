// components/ComponentCustomToast.js
import React from 'react';
import { toast } from 'react-toastify';

const ComponentCustomToast = ({ msg }) => {
  return (
    <div>
      <p className='text-success'>{msg}</p>
    </div>
  );
};

export default ComponentCustomToast;
