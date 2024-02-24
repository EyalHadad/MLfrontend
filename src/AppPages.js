import Home from './pages/Home';
import Browse from './pages/Browse';
import Search from './pages/Search';
import Predict from './pages/Predict';
import Download from './pages/Download';
import Statistics from './pages/Statistics';
import AppPage from './classes/AppPage';
import ContactUs from './pages/ContactUs';

const GetAppPages = (props) => [
    new AppPage('Home', '/', <Home props/>),
    new AppPage('Browse', '/Browse', <Browse props/>),
    new AppPage('Search', '/Search', <Search props/>),
    new AppPage('Predict', '/Predict', <Predict props/>),
    new AppPage('Download', '/Download', <Download props/>),
    new AppPage('Statistics', '/Statistics', <Statistics props/>),
    new AppPage('Contact Us', '/Contact', <ContactUs props/>)
];

export default GetAppPages;