import React from "react";
import ResetPasswordForm from "../components/auth/ResetPassword";
import '../styles/resetPassword.css';
import { useLocation } from "react-router-dom";

const ResetPasswordPage = () => {
    const location = useLocation();

    const token = new URLSearchParams(location.search).get('token');

    return (
        <div className="reset-password-page">
        <ResetPasswordForm token={token} />
        </div>
    );
}

export default ResetPasswordPage;