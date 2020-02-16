import React, { Component } from 'react';
import {
    HashRouter as Router,
    Link,
} from 'react-router-dom';
import headerLogoImg from '../../../assets/logo/logo260x70.png';
import userImg from '../../../assets/img/user.png';
import downArrowImg from '../../../assets/img/downArrow.png';
import Loginbox from '../../../components/shared/LoginBox';
import AuthUserContext from '../../../contexts/AuthUserContext';

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLanguagOptionsOpen: false,
        }
    }

    toggleLanguagOptions = () => {
        this.setState(preState => ({
            ...preState,
            isLanguagOptionsOpen: !preState.isLanguagOptionsOpen
        }))
    }

    render() {
        const { isLanguagOptionsOpen, } = this.state
        const { isLogin, userData } = this.context
        return (
            <Router>
                <header id="header">
                    <div className="flex wrap">
                        <Link to='/' >
                            <div className="header-logo">
                                <img src={headerLogoImg} alt="選山步道 logo" />
                            </div>
                        </Link>
                        <div className="flex header-search">
                            <input type="text" id="search-input" placeholder="請輸入步道名稱" />
                            <div className="search-icon">
                                <i className="fas fa-search"></i>
                            </div>
                        </div>
                        <div className="header-nav">
                            <ul>
                                <Link to='/trails' ><li>全部步道</li></Link>
                                <Link to={`${isLogin ? '/trailCreate' : '/login'}`} >
                                    <li>提供步道</li>
                                </Link>
                                <li >
                                    <div id="header-language-btn" onClick={this.toggleLanguagOptions}>
                                        <p>繁體中文</p>
                                        <div className={`down-arrow-icon ${isLanguagOptionsOpen ? 'active' : ''}`}><img src={downArrowImg} alt="more options logo" /></div>
                                        <div className={`language-options-box ${isLanguagOptionsOpen ? 'active' : ''}`} >
                                            <p>繁體中文</p>
                                            <p>English</p>
                                        </div>
                                    </div>
                                </li>
                                <Link to={`${isLogin ? '/profile' : '/login'}`} >
                                    <div id="header-user-btn">
                                        {
                                            isLogin ? <img src={userData.picture} alt={`${userData.name}的照片`} />
                                                : <img src={userImg} alt="user logo" />
                                        }

                                    </div>
                                </Link>
                            </ul>
                        </div>
                    </div>
                </header>
            </Router>
        )
    }
}

Header.contextType = AuthUserContext
export default Header;