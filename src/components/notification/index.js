import React, { useEffect, useState } from 'react';
import { Button, List, Badge } from 'antd';
import firebase from '../../config/firebase';

export default ({ user, notifications, setNotifications }) => {
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        firebase.database().ref('form').orderByChild('user').equalTo(user.email).once('value', (snapshot) => {
            snapshot.forEach((snap) => {
                if (snap.val().status === "approved")
                    setRequests((reqs) => [...reqs, snap.val()])
            })
        })
    }, []);
    return <div
        style={{
            width: 700,
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
        <List>
            {
                notifications.map((request, index) => {
                    return <List.Item
                        key={index}
                        style={{
                            borderBottomColor: 'rgba(0,0,0,0.1)'
                        }}>
                        <List.Item.Meta
                            title={request.user}
                            description={request.message} />
                    </List.Item>
                })
            }
        </List>
    </div>
}