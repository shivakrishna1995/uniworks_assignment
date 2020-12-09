import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, notification, Select } from 'antd';
// firebase
import firebase from '../../config/firebase';
// components
import UnAuthorized from '../notAuthorized';
import TextArea from 'antd/lib/input/TextArea';

const { Option } = Select;

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 4,
        span: 16,
    },
};

const _user = JSON.parse(localStorage.getItem('user'));

export default ({ user }) => {
    const formRef = useRef();
    const [usersDep, setUsersDep] = useState([]);

    const createForm = async (form) => {
        await firebase.database().ref('form').push({
            ...form,
            status: 'pending',
            seen: false
        })
        notification.open({
            type: 'success',
            message: 'Form created successfully'
        });
        formRef.current.resetFields();
    }

    return <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 40,
            paddingBottom: 40,
            alignItems: 'center'
        }}>
        <h1>FORM</h1>
        <Form
            ref={formRef}
            {...layout}
            initialValues={{
                "createdBy": user.email
            }}
            style={{
                width: 400,
                marginTop: 20
            }}
            onFinish={createForm}>
            <Form.Item
                label="By"
                name="createdBy"
                rules={[{
                    required: true,
                }]}>
                <Input
                    disabled
                    value={"email"} />
            </Form.Item>

            <Form.Item
                label="Dept"
                name="department"
                rules={[{
                    required: true,
                }]}>
                <Select
                    placeholder="Select a department"
                    allowClear
                    onChange={(value) => {
                        setUsersDep([])
                        firebase.firestore().collection('users').where('department', '==', value).get().then((snapshot) => {
                            snapshot.forEach((snap) => {
                                if (snap.id !== user.email)
                                    setUsersDep(st => ([...st, { 'user': snap.id, department: snap.data().department }]))
                            })
                        }).catch((e) => { })
                    }}>
                    {
                        ['Department1', 'Department2', 'Department3'].map((dept, index) => {
                            if (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).department !== dept) {
                                return <Option value={dept}>{dept}</Option>
                            }
                        })
                    }
                </Select>
            </Form.Item>

            <Form.Item
                label="User"
                name="user"
                rules={[{
                    required: true,
                }]}>
                <Select
                    placeholder="Select a user"
                    allowClear
                >
                    {
                        usersDep.map((usr, index) => <Option
                            value={usr.user}
                            key={index}>
                            {usr.user}
                        </Option>)
                    }
                </Select>
            </Form.Item>

            <Form.Item
                label="Message"
                name="message"
                rules={[{
                    required: true,
                }]}>
                <Input.TextArea />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type='primary' htmlType='submit'>
                    SUBMIT
                </Button>
            </Form.Item>
        </Form>
    </div >

}