import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const GlobalPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup immediately when mounted
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  };

  const popupStyle = {
    position: 'relative',
    maxWidth: '90%',
    maxHeight: '90vh',
    backgroundColor: 'transparent',
    borderRadius: '8px',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '-40px',
    right: '0px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '32px',
    cursor: 'pointer',
    zIndex: 1,
  };

  const imageContainerStyle = {
    position: 'relative',
    width: '100%',
  };

  return (
    <div style={overlayStyle} onClick={() => setIsOpen(false)}>
      <style>{`
        .global-popup-container {
          max-width: 90vw;
          width: 400px;
          transition: all 0.3s ease;
        }
        @media (min-width: 768px) { /* Tablet */
          .global-popup-container {
            width: 650px;
          }
        }
        @media (min-width: 1024px) { /* Desktop */
          .global-popup-container {
            width: 850px;
          }
        }
      `}</style>
      <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={() => setIsOpen(false)}>
          &times;
        </button>
        <div style={imageContainerStyle} className="global-popup-container">
          <Image
            src="/assets/imgs/story/popup-image.jpeg"
            alt="Welcome Popup"
            width={850}
            height={850}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalPopup;
