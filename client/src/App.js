import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import { useEffect, useLayoutEffect, useState } from "react"
import { BrowserRouter } from 'react-router-dom';

import './styles/App.css';
import AppRouter from './components/AppRouter';
import AuthRouter from './components/AuthRouter';

import {TokenContext} from './context/tokenContext';
import {UsernameContext} from './context/usernameContext';

function App() {
	const [isAuth, setIsAuth] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
        if(localStorage.getItem('token')) {
            setIsAuth(true);
        } 
    }, [])

	return (
		<TokenContext.Provider value={{
			isAuth,
			setIsAuth: setIsAuth,
			isLoading
		}}>
			<BrowserRouter>
				<AppRouter></AppRouter>
			</BrowserRouter>
		</TokenContext.Provider>
  	);
}

export default App;
