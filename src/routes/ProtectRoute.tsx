import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import useAuth from "../auth/api";

type Props = {
    children: JSX.Element 
}
export const ProtectRoute = ({ children }: Props) => {
    const authApi = useAuth();
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
          const checkLogin = async () => {
            if (authApi.getToken()) {
                const isValidated = await authApi.validateToken();
                if (isValidated) {
                    setIsAuth(true)
                } else {
                    console.error("Token inválido");
                    navigate("/login");
                }
            } else {
                console.error("Token não encontrado");
                navigate("/login");
            }
        }

        checkLogin();
    }, []);
    return isAuth ? children : null
}

