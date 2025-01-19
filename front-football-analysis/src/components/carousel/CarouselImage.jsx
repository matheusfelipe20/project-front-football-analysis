import React, { useState, useEffect } from "react";
import './CarouselImage.css';

import ImageCarousel1 from '../../assets/carousel/footballPage/football-1.png';
import ImageCarousel2 from '../../assets/carousel/footballPage/football-2.png';
import ImageCarousel3 from '../../assets/carousel/footballPage/football-3.png';

const ImageCarousel = [
    ImageCarousel1,
    ImageCarousel2,
    ImageCarousel3,
];
  
const CarouselImage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ImageCarousel.length);
    };

    const prevSlide = () => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + ImageCarousel.length) % ImageCarousel.length
      );
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            nextSlide();
        }, 20000);

        return () => clearInterval(intervalId);
    }, []);

    return (
      <div className="carousel">
        <div className="carousel-container">
          <button className="carousel-prev-btn" onClick={prevSlide}>
            {"<"}
          </button>
          <img
            src={ImageCarousel[currentIndex]}
            alt={`Imagem ${currentIndex + 1}`}
            className="carousel-image"
          />
          <button className="carousel-next-btn" onClick={nextSlide}>
            {">"}
          </button>
        </div>
      </div>
    );
};

export default CarouselImage;