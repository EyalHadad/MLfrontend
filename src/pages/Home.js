import {
  Box,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import homeImage from './../extensions/images/homepage-first-image.png'
import homeImage from './../extensions/images/homepage-second-image.jpg';
import QuickSearch from '../components/QuickSearch';
import { useEffect, useState, useRef, useContext } from 'react';
import { useTheme } from '@emotion/react';
import ApiRequests from '../api/ApiRequests';
import CommonStrings from '../classes/CommonStrings';
import AlertContext from '../components/AlertContext';
import BarChartIcon from '@mui/icons-material/BarChart';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import DNALoading from '../components/DnaLoading';
import About from '../components/About';
import { useLocation } from 'react-router-dom';
// import all images from a path into images
let images = {};
const imagesInObjectSet1 = require.context(
  './../extensions/images/main-stat-images/',
  false,
  /\.(png|jpe?g|svg)$/
);
imagesInObjectSet1.keys().forEach((item, index) => {
  images[item.replace('./', '')] = imagesInObjectSet1(item);
});

function Home() {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
          if (location.pathname.includes('Contact')) {
            // Scroll to the desired component
            const component = document.getElementById('contact-us');
            if (component) {
              window.scrollTo({
                top: component.offsetTop,
                behavior: 'smooth',
              });
            }
          } else {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }

    }, 500)
  }, [location.pathname]);
  const alertContext = useRef(useContext(AlertContext));
  const navigate = useNavigate();
  const homeTitle = 'One place for biological researchers';
  const homeDescription = `miRInterBase is a comprehensive database of experimentally identified miRNA-mRNA interactions, offering valuable insights into miRNA regulatory roles. With a robust set of tools for analyzing interactions from different species, researchers can uncover patterns and relationships through detailed statistics and visualizations. Our prediction page allows the assessment of interaction probabilities between specific miRNA and mRNA sequences.`;
  const textAboveImages = (
    <Box>
      Data can change the world, <br /> And we have lots of it:
    </Box>
  );
  const [generalStats, setGeneralStats] = useState(null);
  const [showStats, setShowStats] = useState(false); // added showStats state
  const theme = useTheme();

  useEffect(() => {
    async function fetchData() {
      const result = await ApiRequests.getGeneralStatistics();
      if (!result) {
        alertContext.current.set(
          'error',
          CommonStrings.apiStrings.userExceptions.generalErrorTitle,
          CommonStrings.apiStrings.userExceptions.generalErrorTitle,
          <Button
            onClick={() => {
              window.location.reload();
              alertContext.current.clear();
            }}
          >
            RELOAD
          </Button>,
          10000
        );
        return;
      }
      setGeneralStats(result);
      setShowStats(true); // set showStats to true when data is fetched
    }
    fetchData();
  }, []);

  return (
    <div style={{ marginTop: '20vh' }}>
      {/* Box with display grid allows placing elements in a grid on screen */}
      {/* Upper part divided in 2 */}
      <Box
        display='grid'
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        gap={2}
      >
        <Box sx={{ margin: '2vh', paddingTop: { md: '0vh' } }}>
          <Typography
            color={'primary'}
            sx={{
              fontWeight: 700,
              fontSize: { xs: 'medium', md: 'x-large' },
              textDecoration: 'underline',
            }}
          >
            {homeTitle}
          </Typography>
          <Typography
            color={'primary'}
            sx={{
              fontSize: {
                xs: 'x-small',
                md: 'medium',
                lg: 'medium',
                xl: 'large',
              },
            }}
          >
            {homeDescription}
          </Typography>

          <Box sx={{ marginTop: '3vh' }}>
            <QuickSearch afterResultsAreInStorage={() => navigate('/Search')} />
          </Box>
          <Button
            onClick={() => navigate('/Search')}
            sx={{ marginTop: '2vh' }}
            color='primary'
            variant='contained'
          >
            Full Search Page <FindInPageIcon />
          </Button>
        </Box>
        <Box sx={{ margin: '2vh', paddingTop: { md: '3vh' } }}>
          <Box
            sx={{
              width: '60%',
              marginLeft: '20vh',
              margin: 'auto',
              opacity: 0,
              animation: 'fade-in 5s forwards',
            }}
          >
            <img
              style={{
                borderRadius: '2%',
                boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.5)',
              }}
              src={homeImage}
              width={'100%'}
              height={'100%'}
              alt=''
            />
          </Box>
          <style>
            {`
            @keyframes fade-in {
              0% {
                opacity: 0;
              }
              100% {
                opacity: 1;
              }
            }
          `}
          </style>
        </Box>
      </Box>

      {/* Bottom part with several images */}
      <Typography
        component='span'
        color={'primary'}
        sx={{
          marginTop: '5vh',
          fontWeight: 700,
          fontSize: { xs: 'small', md: 'large' },
        }}
      >
        {textAboveImages}
      </Typography>

      {!generalStats ? (
        <DNALoading></DNALoading>
      ) : (
        <Box
          display='grid'
          gridTemplateColumns={{
            xs: 'repeat(1,1fr)',
            md:
              'repeat(' +
              Object.keys(generalStats.statistics).length +
              ', 1fr)',
          }}
          gap={2}
          sx={{ margin: '1vh', marginTop: '4vh', borderRadius: 2 }}
        >
          {Object.keys(generalStats.statistics).map((stat, index) => (
            <Box
              key={stat}
              sx={{
                borderRadius: 2,
                boxShadow: 14,
                width: '100%',
                height: '80%',
                opacity: 0,
                animation: `${showStats ? 'fade-in' : ''} 0.5s forwards ${
                  index / 2
                }s`, // use showStats state and delay based on index
              }}
            >
              <Paper
                sx={{
                  backgroundColor: theme.palette.background.default,
                  borderColor: theme.palette.primary.light,
                }}
                width={'100%'}
                height={'100%'}
              >
                <Box position={'relative'} height='12vh'>
                  <Box display={'grid'} gridTemplateColumns={'repeat(2, 1fr)'}>
                    <Typography
                      color={'primary'}
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: 'xx-large', md: 'xx-large' },
                        position: 'relative',
                        textAlign: 'start',
                        left: '1vh',
                      }}
                    >
                      {generalStats.statistics[stat]}
                    </Typography>
                    <img
                      src={Object.values(images)[index]}
                      alt=''
                      width={'70%'}
                      height={'60%'}
                      style={{ marginLeft: '10%', marginTop: '1vh' }}
                    ></img>
                  </Box>
                  <Box sx={{ position: 'absolute', bottom: 0 }}>
                    <Typography
                      color={'primary'}
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: 'large', md: 'large' },
                        position: 'relative',
                        bottom: 0,
                        left: '1vh',
                      }}
                    >
                      {stat}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      )}
      {generalStats ? (
        <Button
          size='large'
          onClick={() => navigate('/Statistics')}
          sx={{ marginTop: '4vh',  marginBottom: '2vh' }}
          color='primary'
          variant='contained'
        >
          For more statistics <BarChartIcon />
        </Button>
      ) : null}

      <Box marginTop={'10vh'} marginBottom={'20vh'}>
        <About></About>
      </Box>
    </div>
  );
}

export default Home;