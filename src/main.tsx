import ReactDOM from 'react-dom/client'

import { RouterProvider } from 'react-router-dom'
import Routers from './Routers'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <RouterProvider router={Routers} />
  // </React.StrictMode>,
)
