import * as React from 'react';
import { Routes,Route} from 'react-router-dom'
import{BrowserRouter} from 'react-router-dom'
import SignUp from './components/user/signup/signup';


export default function MyApp() {
  return (
    <div>
       <BrowserRouter>
       <Routes>  
       <Route path="/sign-up"  element={<SignUp />} />
       </Routes>
       </BrowserRouter>
    </div>
  );
}