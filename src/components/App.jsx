import React, { useEffect, useState } from 'react';
import { Searchbar } from './Searchbar';
import css from './App.module.css';
import { fetchImages } from 'services/api';
import { ColorRing } from 'react-loader-spinner';
import { Modal } from './Modal';
import { ImageGallery } from './ImageGallery';
import { Button } from './Button';

export const App = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [totalImage, setTotalImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, modalData: null });

  useEffect(() => {
    if (query === '' && page === 1) return;

    const getImages = async () => {
      try {
        setIsLoading(true);
        const imagesApi = await fetchImages(query, page);
        setGallery(prevState => [...prevState, ...imagesApi.hits]);
        setTotalImage(imagesApi.totalHits);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getImages();
  }, [query, page]);

  const handleSearch = searchQuery => {
    setQuery(searchQuery);
    setPage(1);
    setGallery([]);
    setTotalImage(0);
  };

  const handleLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const onOpenModal = largeImageURL => {
    setModal({ isOpen: true, modalData: largeImageURL });
  };

  const onCloseModal = () => {
    setModal({ isOpen: false, modalData: null });
  };

  return (
    <div className={css.appContainer}>
      <Searchbar handleSearch={handleSearch} />
      {isLoading === true && (
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
      )}
      <ImageGallery gallery={gallery} onOpenModal={onOpenModal} />

      {!isLoading && totalImage !== gallery.length && (
        <Button handleLoadMore={handleLoadMore} />
      )}
      {error && <p>Error: {error}</p>}
      {modal.isOpen && (
        <Modal onCloseModal={onCloseModal} modalData={modal.modalData} />
      )}
    </div>
  );
};
