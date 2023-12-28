import { Link } from "react-router-dom";
import React from "react";
import AppContext from "../../context";

function Header() {
  const { openCart, totalSumCart, counterFavorites } =
    React.useContext(AppContext);

  return (
    <header className="header">
      <Link to="/app2-GitPage-/">
        <div className="header-left">
          <img src="./images/header_logo.svg" alt="logo" />
          <div className="info">
            <div className="title">REACT SNEAKERS</div>
            <div className="text">Магазин лучших кроссовок</div>
          </div>
        </div>
      </Link>
      <ul className="header-right">
        <li className="cart" onClick={openCart}>
          <img src="./images/header_cart.svg" alt="cart" />
          <span className="text">{totalSumCart} руб.</span>
        </li>
        <Link to="/app2-GitPage-/favorites">
          <li className="bookmarks" color="color_red">
            <img src="./images/header_bookmarks.svg" alt="bookmarks" />
            <span className="text">Закладки {counterFavorites()}</span>
          </li>
        </Link>
        <Link to="/app2-GitPage-/orders">
          <li className="profile">
            <img src="./images/header_profile.svg" alt="profile" />
            <span className="text">Профиль</span>
          </li>
        </Link>
      </ul>
    </header>
  );
}

export default Header;
