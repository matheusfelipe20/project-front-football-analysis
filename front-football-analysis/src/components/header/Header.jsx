import React from 'react';
import './header.css';
import imgHeader from '../../assets/logo-header.png'
import iconFootball from '../../assets/icons/icon-football.svg'
import iconConfiguration from '../../assets/icons/icon-configuration.svg'
import { Link } from 'react-router-dom';
import HeaderSearch from './headerSearch/HeaderSearch';

const Header = () => {

    return (
        <header>
            <div className="header">
                <div className="header-top">
                    <div className="header-logo">
                        <Link to="/">
                            <img className="logo" src={imgHeader} alt="Logo MatthScore" />
                            <p className="logo-name">MatthScore</p>
                        </Link>
                    </div>
                    <div className="header-search">
                        <HeaderSearch/>
                    </div>
                </div>
                <div className="header-down">
                    <div className="nav-links-options">
                        <nav>
                            <ul className="nav-links">
                                <li>
                                    <Link className="nav-options" to="/">
                                        <img className="nav-icon" src={iconFootball} alt="icone football" />
                                        <p className="nav-name">Futebol</p>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="nav-options" to="/">
                                        <img className="nav-icon-config" src={iconConfiguration} alt="icone football" />
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
