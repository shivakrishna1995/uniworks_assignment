import React, { useEffect, useState } from 'react';
import { Button, List, Divider, notification } from 'antd';
import firebase from '../../config/firebase';

export default ({ user }) => {
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        firebase.database().ref('form').orderByChild('user').equalTo(user.email).once('value', (snapshot) => {
            snapshot.forEach((snap) => {
                if (snap.val().status === "pending")
                    setRequests((reqs) => [...reqs, { ...snap.val(), id: snap.key }])
            })
        })
    }, []);

    const acceptClicked = async (id) => {
        await firebase.database().ref('form').child(id).update({ status: 'approved', seen: true });
        notification.open({
            type: 'success',
            message: 'Approved'
        });
        setRequests(reqs => reqs.filter(x => x.id !== id));
    }

    const rejectClicked = async (id) => {
        await firebase.database().ref('form').child(id).update({ status: 'rejected', seen: true });
        notification.open({
            type: 'success',
            message: 'Rejected'
        });
        setRequests(reqs => reqs.filter(x => x.id !== id));
    }

    return <div
        style={{
            width: 700,
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
        <List>
            {
                requests.map((request, index) => {
                    return <List.Item
                        key={index}
                        style={{
                            borderBottomColor: 'rgba(0,0,0,0.1)'
                        }}>
                        <List.Item.Meta
                            title={request.user}
                            description={request.message} />
                        <Button
                            onClick={() => acceptClicked(request.id)}
                            type="primary">
                            Accept
                            </Button>
                        <Button
                            onClick={() => rejectClicked(request.id)}
                            type="primary"
                            danger>
                            Reject
                            </Button>
                    </List.Item>
                })
            }
        </List>
    </div>
}