import React, { useState, useEffect } from 'react';

const Navbar = ({ isBlackBg }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Si `isBlackBg` es true, el navbar tendrá el fondo negro
  const navbarBgClass = isBlackBg || isScrolled ? 'bg-black bg-opacity-90' : 'bg-white bg-opacity-5 backdrop-blur-sm';

  return (
    <header
      className={`fixed top-0 w-full z-50 duration-1000 ease-in-out ${navbarBgClass}`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between text-xl">
        <a href="/" className="text-white font-bold text-4xl">
          MiLogo
        </a>
        <div className="space-x-6">
          <a href="#home" className="text-white hover:text-gray-300">
            Inicio
          </a>
          <a href="#services" className="text-white hover:text-gray-300">
            Servicios
          </a>
          <a href="#contact" className="text-white hover:text-gray-300">
            Contacto
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
