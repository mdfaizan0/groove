import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Error from './pages/Error.jsx'
import { lazy, Suspense } from 'react'
import AudioProvider from './context/audio/AudioProvider.jsx'
import AuthProvider from './context/auth/AuthProvider.jsx'
import ThemeProvider from './context/theme/ThemeProvider'
import MainLayout from './layouts/MainLayout.jsx'
import Loading from './components/Loading'

const Home = lazy(() => import("./pages/Home.jsx"))
const Login = lazy(() => import("./pages/Login.jsx"))
const SignUp = lazy(() => import("./pages/SignUp.jsx"))
const Playlists = lazy(() => import("./pages/Playlists.jsx"))
const PlaylistDetail = lazy(() => import("./pages/PlaylistDetail.jsx"))
const Podcasts = lazy(() => import("./pages/Podcasts.jsx"))
const PodcastDetail = lazy(() => import("./pages/PodcastDetail.jsx"))
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"))
const Search = lazy(() => import("./pages/Search.jsx"))
const Explore = lazy(() => import("./pages/Explore.jsx"))
const Library = lazy(() => import("./pages/Library.jsx"))
const ProtectedRoute = lazy(() => import("./routes/ProtectedRoute.jsx"))

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      { path: "/login", element: <Suspense fallback={<Loading />}><Login /></Suspense> },
      { path: "/signup", element: <Suspense fallback={<Loading />}><SignUp /></Suspense> },
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <Suspense fallback={<Loading />}><Home /></Suspense> },
          { path: "/search", element: <Suspense fallback={<Loading />}><Search /></Suspense> },
          { path: "/explore", element: <Suspense fallback={<Loading />}><Explore /></Suspense> },
          { path: "/podcasts", element: <Podcasts /> },
          { path: "/podcast/:collectionId", element: <PodcastDetail /> },

          {
            element: <ProtectedRoute />,
            children: [
              { path: "/dashboard", element: <Dashboard /> },
              { path: "/library", element: <Suspense fallback={<Loading />}><Library /></Suspense> },
              { path: "/playlists", element: <Playlists /> },
              { path: "/playlists/:playlistId", element: <PlaylistDetail /> },
            ]
          },
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <AudioProvider>
        <RouterProvider router={router} />
      </AudioProvider>
    </AuthProvider>
  </ThemeProvider>
)
