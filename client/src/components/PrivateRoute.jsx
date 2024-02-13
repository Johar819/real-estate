import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoute = () => {
    const {currentUser} = useSelector(state=>state.user);
  if(currentUser)
  {
      return (
      <Outlet/>
      )
  }  else{
    return <Navigate to="/"/>;
  }
  
}

export default PrivateRoute