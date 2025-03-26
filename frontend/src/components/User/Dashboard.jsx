import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs } from 'react-bootstrap';
import MetaData from '../Layouts/MetaData';
import OrderHistory from './OrderHistory';
import ProfileSettings from './ProfileSettings';
import Wishlist from './Wishlist';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useSelector((state) => state.user);
    const [key, setKey] = useState('profile');

    return (
        <>
            <MetaData title="User Dashboard | Flipkart" />
            <div className="dashboard-container">
                <h2 className="dashboard-heading">My Account</h2>
                <div className="dashboard-tabs">
                    <Tabs
                        id="dashboard-tabs"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="profile" title="Profile Settings">
                            <ProfileSettings user={user} />
                        </Tab>
                        <Tab eventKey="orders" title="Order History">
                            <OrderHistory />
                        </Tab>
                        <Tab eventKey="wishlist" title="Wishlist">
                            <Wishlist />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
