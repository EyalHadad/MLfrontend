import './App.css';
import Navbar from './components/Navbar';
import GetAppPages from './AppPages';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import {createTheme, CssBaseline} from '@mui/material';
import { purple, grey, deepPurple } from '@mui/material/colors';
import Alert from './components/Alert';
import AlertProvider from './components/AlertProvider';
import {useEffect, useState} from 'react';
import {useLocalStorage} from "./components/useLocalStorage";
import CommonStrings from './classes/CommonStrings';
import lightLogo from './extensions/images/logo/light_color_logo.png';
import darkLogo from './extensions/images/logo/dark_white_logo.png';
import { resetLocalStorage } from './components/useLocalStorage';

function App() {
  // get the app pages in a generic way, pass to the nav bar, and use in creating the routes
  const appPages = GetAppPages();
  
  const lightTheme = createTheme({
    lightMode: true, // whether switching mode is to dark
    logoImage: lightLogo,
    palette: {
      background: {
        default: grey[100],
      },
      primary: {
        main: purple[700],
        dark: '#4f114f',
        light: '#822f82',
        grey: 'rgba(241,240,243,0.75)'
      },
      secondary: {
        main: '#F8F8FF', // kind of white        
        dark: '#ede4ed', // white - grey - a little bit of pink
        secondary: '#F8F8FF', // kind of white
        modal: grey[900]
      }    
    },
    typography:{
      button: {
        textTransform: 'none',
      },
      fontFamily: 'monospace',
      fontWeightBold: 700,
      fontWeightRegular: 500,
    }
  });  
  const darkTheme = createTheme({
    // in dark theme the context is opposite to light mode, so 
    // dark can actually be lighter and light can be darker..
    lightMode: false, // whether switching mode is to dark
    logoImage: darkLogo,
    palette: {
      background: {
        default: grey[900],
      },
      primary: {
        main: purple[300],
        dark: purple[800],
        light: purple[400],
        grey: 'rgba(224,218,234,0.75)'
      },
      secondary: {
        main: grey[800], // kind of white        
        dark: purple[200],
        light: deepPurple[50], // white - grey - a little bit of pink
        modal: purple[50],
        secondary: purple[50],
      }    
    },
    typography:{
      button: {
        textTransform: 'none',
      },
      fontFamily: 'monospace',
      fontWeightBold: 700,
      fontWeightRegular: 500,
    }
  });

  useEffect(() => {
    resetLocalStorage();
  },[])

  const [themeType, setThemeType] = useLocalStorage(CommonStrings.localStorageStrings.theme.mode, 
    CommonStrings.localStorageStrings.theme.lightMode);
  const [theme, setTheme] = useState(themeType === CommonStrings.localStorageStrings.theme.lightMode ? 
    lightTheme : darkTheme);
  const changeTheme = () => {
    if(themeType === CommonStrings.localStorageStrings.theme.lightMode){
      setTheme(darkTheme)
      setThemeType(CommonStrings.localStorageStrings.theme.darkMode)
    }
    else{
      setTheme(lightTheme)
      setThemeType(CommonStrings.localStorageStrings.theme.lightMode)
    }
  }
  return (
    <div className="App"> 
      <ThemeProvider theme={theme}>      
        <AlertProvider>
          <CssBaseline/>
          {/* theme provider is for coloring, typography etc..
          alert context is for showing alerts from different pages */}
          <Alert></Alert>
          <Router>
            <Navbar appPages={appPages} changeTheme={changeTheme}/>
            <Routes>
              {
                appPages.map(appPage => 
                  <Route key={appPage.route} path={appPage.route} element={appPage.component}></Route>)
              }
            </Routes>
          </Router>
        </AlertProvider>
      </ThemeProvider>     
    </div>
  );
}

export default App;
