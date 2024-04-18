import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../App/Home";
import Video from "../App/Video";
import Channel from "../App/Channel";
import Search from "../App/Search";

export default createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/videos/:id',
        element: <Video />
      },
      {
        path: '/channels/:id',
        element: <Channel />
      },
      {
        path: '/search/:query',
        element: <Search />
      }
    ]
  }
])