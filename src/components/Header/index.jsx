import React from 'react';
import { Link } from 'react-router-dom';

import { firebaseSignOut } from '../../App/firebase-model';

import './header_styles.css';

const Header = ({ signOutAuth }) => {
  return (
    <section className='header'>
      <nav>
        <ul className='list-container'>
          {/* {window.matchMedia("(max-width: 1200px)").matches ? null : (
            <Link className="list-item" to="/">
              <li>Home</li>
            </Link>
          )} */}
          <Link className='list-item' to='/stocks'>
            <li>Stocks</li>
          </Link>

          <Link className='list-item' to='/budget'>
            <li>Budget</li>
          </Link>
          <Link className='list-item' to='/analysis'>
            <li>Analysis</li>
          </Link>
        </ul>

        <button
          className='sign-out action button'
          onClick={(e) => {
            firebaseSignOut(signOutAuth);
          }}
        >
          Signout
        </button>
      </nav>
    </section>
  );
};

export default Header;
