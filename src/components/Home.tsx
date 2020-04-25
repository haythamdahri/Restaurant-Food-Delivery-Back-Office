import React, { useEffect } from 'react';
import AuthService from '../services/AuthService';
import { useHistory } from 'react-router-dom';

export default () => {

    let history = useHistory();

    useEffect(() => {
        // Check if user is authenticated
        if( !AuthService.isAuthenticated() ) {
            // Redirect to sign in page
            history.push('/signin');
        }
    }, [])

    return (
        <div className="display-4 text-center">
            HOME
        </div>
    );

}