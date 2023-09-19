import React from 'react';

// btnType can be "primary" | "outline"

const IconButton = ({ btnText, btnIcon, btnType, isLoading, className }) => {
  let classNm = btnType === 'primary' ? 'btn-primary' : 'btn-outline';
  return (
    <button
      type="submit"
      className={`btn-icon ${classNm} ${className}`}
      disabled={isLoading}
    >
      <span>{btnText}</span>
      <span>{btnIcon}</span>
    </button>
  );
};

IconButton.type = 'primary' || 'outline';

export default IconButton;
