import './App.css';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom'
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import DogCreator from './components/DogCreator';
import Details from './components/Details';


function App() {
  return (
      <div className="App">
        <Router> {/* Me permite acceder al historial de navegacion, realizar redirecciones, etc */}
          <Switch>
            <Route exact path='/' component={LandingPage}/>
            <Route exact path='/home' component={Home}/>
            <Route exact path='/dog' component={DogCreator} />
            <Route exact path='/dogs/:id' component={Details}/>
          </Switch>
        </Router>
      </div> 
  );
}

export default App;
