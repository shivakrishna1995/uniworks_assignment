import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
    return <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            paddingTop: 40,
            paddingBottom: 40,
            alignItems: 'center'
        }}>
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
            }}>
            <h1>401</h1>
            <h1>UNAUTHORIZED</h1>
        </div>
        <Link to='/login'>Please login to proceed</Link>
    </div>
}