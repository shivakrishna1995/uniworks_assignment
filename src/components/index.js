import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Layout, Badge, Menu, notification } from 'antd';
import 'antd/dist/antd.css';
import { BellFilled } from '@ant-design/icons';
// components
import Form from './form';
import Pending from './pending';
import Approved from './approved';
import Requests from './requests';
import Rejects from './rejects';
import Notifications from './notification';
import Login from './login';
import SignUp from './signUp';
import UnAuthorized from './notAuthorized';
// firebase
import firebase from '../config/firebase';

const { Header, Content } = Layout;

export default () => {
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // firebase auth listener
    useEffect(() => {
        firebase.auth().onAuthStateChanged((usr) => {
            if (usr) {
                setUser({ email: usr.email })
            } else {
                setUser(null)
            }
        })
    }, []);

    // live notification watch
    useEffect(() => {
        if (user) {
            firebase.database().ref('form').orderByChild('user').equalTo(user.email).on('value', (snapshot) => {
                setNotifications([]);
                snapshot.forEach((snap) => {
                    if (!snap.val().seen) {
                        setNotifications(nts => [...nts, { ...snap.val(), id: snap.key }])
                        notification.open({
                            type: 'success',
                            message: `Notification from ${snap.val().createdBy}`
                        })
                    }
                })
            })
        }
    }, [user]);

    const _rendserRoutes = () => {
        return <Switch>
            <Route exact path="/" render={() => user !== null ? <Form user={user} /> : <UnAuthorized />} />
            <Route exact path="/pending" render={() => user !== null ? <Pending user={user} /> : <UnAuthorized />} />
            <Route exact path="/approved" render={() => user !== null ? <Approved user={user} /> : <UnAuthorized />} />
            <Route exact path="/requests" render={() => user !== null ? <Requests user={user} /> : <UnAuthorized />} />
            <Route exact path="/rejects" render={() => user !== null ? <Rejects user={user} /> : <UnAuthorized />} />
            <Route exact path="/notification" render={() => user !== null ? <Notifications user={user} notifications={notifications} setNotifications={setNotifications} /> : <UnAuthorized />} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
        </Switch>
    }

    return <Router>
        <Layout>
            <Header
                style={{
                    display: 'flex'
                }}>
                <div
                    style={{
                        color: 'white'
                    }}>
                    UNIWORKS ASSIGNMENT
            </div>
                <Menu
                    mode='horizontal'
                    theme='dark'
                    style={{
                        display: 'flex',
                        flex: 1,
                        marginLeft: 120
                    }}>
                    <Menu.Item>
                        <Link to='/'>
                            FORM
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to='/pending'>
                            PENDING
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to='/approved'>
                            APPROVED
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to='/requests'>
                            REQUESTS
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to='/rejects'>
                            REJECTS
                        </Link>
                    </Menu.Item>
                    <Menu.Item
                        style={{
                            marginLeft: 'auto',
                        }}>
                        <Link to='/notification'>
                            <BellFilled color="white" />
                            {/* <Badge dot offset={[-13, -6]} /> */}
                        </Link>
                    </Menu.Item>
                    {
                        user === null ?
                            <Fragment>
                                <Menu.Item>
                                    <Link to='/login'>
                                        LOGIN
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link to='/signup'>
                                        SIGNUP
                                    </Link>
                                </Menu.Item>
                            </Fragment> :
                            <Menu.Item
                                onClick={
                                    () => {
                                        firebase.auth().signOut();
                                        localStorage.clear();
                                        notification.open({
                                            type: 'success',
                                            message: 'Logged out successfully'
                                        })
                                    }
                                }>
                                <Link>
                                    LOGOUT
                                </Link>
                            </Menu.Item>
                    }

                </Menu>
            </Header>
            <Content>
                {_rendserRoutes()}
            </Content>
        </Layout>
    </Router>
}