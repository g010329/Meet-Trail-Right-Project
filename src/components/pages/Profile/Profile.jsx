import React, { Component, Fragment } from 'react';
import {
    HashRouter as Router,
    Route,
    Link,
    Switch
} from "react-router-dom";
import { DB } from '../../../lib'
import Header from '../../shared/Header';
import Footer from '../../shared/Footer';
import ProfileLike from './ProfileLike.jsx';
import ProfileRecord from './ProfileRecord.jsx';
import ProfileReport from './ProfileReport.jsx';
import ProfileComment from './ProfileComment.jsx';
import ProfileTrail from './ProfileTrail.jsx';
import AuthUserContext from '../../../contexts/AuthUserContext';


const profileRoutes = [
    {
        path: "/profile",
        exact: true,
        main: () => <ProfileLike />
    },
    {
        path: "/profile/record",
        exact: true,
        main: () => <ProfileRecord />
    },
    {
        path: "/profile/comment",
        exact: true,
        main: () => <ProfileComment />
    },
    {
        path: "/profile/report",
        exact: true,
        main: () => <ProfileReport />
    },
    {
        path: "/profile/trail",
        exact: true,
        main: () => <ProfileTrail />
    }
]

class Profile extends Component {

    signOut = () => {
        DB.signOut()
    }

    uploadUserImg = (e) => {
        const { userData, handleUserData } = this.context
        const file = e.target.files[0]

        if (file.size > 1000000) {
            console.log('檔案過大')
        } else {
            const uploadTask = DB.storageRef(`/users/${userData.id}/${userData.name}的照片`).put(file)
            uploadTask.on('state_changed', snapshot => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done')
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, error => {
                console.log(error)
            }, () => {
                // Handle successful uploads on complete
                uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadURL => {
                        const newUserData = {
                            ...userData,
                            picture: downloadURL
                        }
                        handleUserData(newUserData)
                        console.log('File available at', downloadURL)
                    })
            })
        }
    }

    render() {
        const pathName = this.props.location.pathname
        const { userData } = this.context

        return (
            <Fragment>
                <Header />
                <section id="profile">
                    <div className="flex wrap">
                        <div className="profile-aside">
                            <div className="profile-aside-user">
                                <div className="user-img-wrap">
                                    <div className="user-img">
                                        <label htmlFor="upload-img" className="upload-img">上傳圖片</label>
                                        <img src={userData.picture} alt={`${userData.name}的照片`} />
                                        <input
                                            type="file"
                                            id="upload-img"
                                            onChange={this.uploadUserImg}
                                        />
                                    </div>
                                </div>

                                <div className="user-name-wrap">
                                    <div className="user-name">
                                        <p>{userData.name}</p>
                                    </div>
                                </div>
                                <div className="user-status-wrap">
                                    <div className="user-status">
                                        <p>{userData.status}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="profile-aside-menu">
                                <Router>
                                    <ul>
                                        <Link to="/profile">
                                            <li className={`${pathName === '/profile' ? 'active' : ''}`}>
                                                <i className="fas fa-heart"></i>
                                                <p>我的收藏</p>
                                            </li>
                                        </Link>
                                        <Link to="/profile/record">
                                            <li className={`${pathName === '/profile/record' ? 'active' : ''}`}>
                                                <i className="fas fa-map-signs"></i>
                                                <p>步道紀錄</p>
                                            </li>
                                        </Link>
                                        <Link to="/profile/comment">
                                            <li className={`${pathName === '/profile/comment' ? 'active' : ''}`}>
                                                <i className="fas fa-comment"></i>
                                                <p>步道評論</p>
                                            </li>
                                        </Link>
                                        <Link to="/profile/report">
                                            <li className={`${pathName === '/profile/report' ? 'active' : ''}`}>
                                                <i className="fas fa-bullhorn"></i>
                                                <p>步道近況回報</p>
                                            </li>
                                        </Link>
                                        <Link to="/profile/trail">
                                            <li className={`${pathName === '/profile/trail' ? 'active' : ''}`}>
                                                <i className="fas fa-mountain"></i>
                                                <p>我提供的步道</p>
                                            </li>
                                        </Link>
                                    </ul>
                                </Router>
                                <button
                                    id="sign-out-btn"
                                    className="flex"
                                    onClick={this.signOut}
                                >
                                    <p>登出</p>
                                </button>
                            </div>
                        </div>

                        <div className="profile-main">
                            <Switch>
                                {profileRoutes.map((route, index) => (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        exact={route.exact}
                                        children={<route.main />}
                                    />
                                ))}
                            </Switch>
                        </div>
                    </div>
                </section>
                <Footer />
            </Fragment >
        )
    }
}


Profile.contextType = AuthUserContext
export default Profile;