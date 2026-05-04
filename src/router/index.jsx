import { Suspense, lazy } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { Spin } from "antd";

const Issues = lazy(() => import("../pages/Issues"));
const Books = lazy(() => import("../pages/Books"));
const Interviews = lazy(() => import("../pages/Interviews"));
const AddIssue = lazy(() => import("../pages/AddIssue"));
const IssueDetail = lazy(() => import("../pages/IssueDetail"));

const routes = [
    {
        path: "/",
        element: <Navigate to="/issues" replace />
    },
    {
        path: "/issues",
        element: <Issues />,
    },
    {
        path: "/issue/:id",
        element: <IssueDetail />
    },
    {
        path: "/addIssue",
        element: <AddIssue />
    },
    {
        path: "/books",
        element: <Books />
    },
    {
        path: "/interviews",
        element: <Interviews />
    }
];

export default function RouterConfig() {
    const element = useRoutes(routes);

    return (
        <Suspense fallback={
                <div className="loading">
                    <Spin />
                </div>
        }>
            {element}
        </Suspense>
    );
}