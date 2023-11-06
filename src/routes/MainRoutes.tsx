
//importando funções para usar rotas
import { useRoutes } from 'react-router-dom'
import { Login } from '../pages/Login/Login'
import { Home } from '../pages/Home/Home'
import { ProtectRoute } from './ProtectRoute'
import { NotFound } from '../pages/NotFound/NotFound'
import { BasicAppShell } from '../layout/BasicAppShell'
import { Financiamentos } from '../pages/Financiamentos/Financiamentos'
import { RedirectLogin } from './RedirectLogin'


export const MainRoutes = () => {
  return useRoutes(
    [
      {
        path: "/",
        /* element: <ProtectRoute><Home /></ProtectRoute> */
        element: <ProtectRoute><BasicAppShell><Home/></BasicAppShell></ProtectRoute>
      },
      {
        path: "/financiamentos",
        element:<ProtectRoute><BasicAppShell><Financiamentos/></BasicAppShell></ProtectRoute>
      },
      {
        path: "/Login",
        element: <RedirectLogin><Login /></RedirectLogin>
      },
      {
        path: "*",
        element: <NotFound/>
      },
    ]
  )

}