import React, { useEffect } from 'react';
import css from './App.module.css';

export const Modal = ({ onCloseModal, modalData }) => {
  const handleOverlay = event => {
    if (event.currentTarget === event.target) {
      onCloseModal();
    }
  };

  useEffect(() => {
    const onKeyDown = event => {
      if (event.code === 'Escape') {
        onCloseModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onCloseModal]);

  return (
    <div onClick={handleOverlay} className={css.overlay}>
      <div className={css.modal}>
        <img src={modalData} alt="" />
      </div>
    </div>
  );
};
