// Button.js
import React from 'react';

function Button({ label, onClick, className, ...props }) {
  return (
    <button className={className} onClick={onClick} {...props}>
      {label}
    </button>
  );
}

export default Button;
