import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Style/Navbar.module.css';
import logo from './Assets/Logo.png';

function Navbar() {
  const [isActive, setIsActive] = useState(false);

  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  const removeActive = () => {
    setIsActive(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav className={`${styles.navbar}`}>
          <NavLink to='/' className={styles.logo}>
            <img src={logo} alt="Logo" style={{ width: '50px', height: 'auto' }} />
          </NavLink>
          <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
            <li onClick={removeActive}>
              <NavLink to='/' className={`${styles.navLink}`} activeClassName={styles.active}>Home</NavLink>
            </li>
            <li onClick={removeActive}>
              <NavLink to='/add' className={`${styles.navLink}`} activeClassName={styles.active}>Add</NavLink>
            </li>
            <li onClick={removeActive}>
              <NavLink to='/expenses' className={`${styles.navLink}`} activeClassName={styles.active}>Expenses</NavLink>
            </li>
            <li onClick={removeActive}>
              <NavLink to='/help' className={`${styles.navLink}`} activeClassName={styles.active}>Help</NavLink>
            </li>
          </ul>
          <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`} onClick={toggleActiveClass}>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;
