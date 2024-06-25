import ToDo from './Components/ToDo-list';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Updatefruit from './Components/Updatefruit';
import StickyNote from './Stiky Note/StickyNote';
import Updatestiky from './Stiky Note/Updatestiky';

function App() {
  return (
 
    <div className='App'>

    <BrowserRouter>
      
      <Routes>
        <Route path='/' Component={StickyNote}/>
      </Routes>
     
    </BrowserRouter>
    </div>
  
  )
}

export default App;
