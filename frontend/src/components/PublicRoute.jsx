import { Navigate } from "react-router-dom";

import { useCurrentUserContext } from "../context/CurrentUserContext";

function PublicRoute({ children }) {

    const {
        user,
        loading,
    } = useCurrentUserContext();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default PublicRoute;