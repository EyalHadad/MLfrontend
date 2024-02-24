import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Box, Button, Snackbar } from '@mui/material';
import shuffle from 'lodash.shuffle';
import shaharImage from './../extensions/images/contact-images/shahar.svg';
import benImage from './../extensions/images/contact-images/ben.svg';
import katyaImage from './../extensions/images/contact-images/katya.svg';
import uriImage from './../extensions/images/contact-images/uri.svg';
import eyalImage from './../extensions/images/contact-images/eyal.svg';
import isanaImage from './../extensions/images/contact-images/isana.svg';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

export default function ContactUs() {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [shuffledContactInfo, setShuffledContactInfo] = useState([]);

  const contactInfo = useMemo(() => [
    {
      name: 'Dr. Isana Veksler Lublinsky',// Dr.!!!!!!!!!!! changed
      image: isanaImage,
      desc: 'Head of the project, Domain Expert',
      email: 'vaksler@post.bgu.ac.il',
      linkedin: 'https://www.linkedin.com/in/isana-veksler-lublinsky-45527645/'
    },
    {
      name: 'Eyal Hadad',
      image: eyalImage,
      desc: 'Project Manager, ML Engineer',
      email: 'eyalhad@post.bgu.ac.il',
      linkedin: 'https://www.linkedin.com/in/eyal-hadad-5b3b9a110/'
    },
    {
      name: 'Shahar Kramer',
      image: shaharImage,
      desc: 'Backend Developer',
      email: null,
      linkedin: 'https://www.linkedin.com/in/shahar-kramer/'
    },
    {
      name: 'Ben Aidlin',
      image: benImage,
      desc: 'Frontend Developer',
      email: null,
      linkedin: 'https://www.linkedin.com/in/ben-aidlin-0a2830211/'
    },
    {
      name: 'Katya Donchenko',
      image: katyaImage,
      desc: 'Frontend Developer',
      email: null,
      linkedin: 'https://www.linkedin.com/in/katya-donchenk0/'
    },
    {
      name: 'Uri Zlotkin',
      image: uriImage,
      desc: 'Backend Developer',
      email: null,
      linkedin: 'https://www.linkedin.com/in/uri-zlotkin/'
    },
  ], []);

  useEffect(() => {
    const shuffledArray = [...contactInfo]; // Create a copy of contactInfo
    // Shuffle the array, excluding the first two elements
    const shuffledRemaining = shuffle(shuffledArray.slice(2));
    // Combine the shuffled remaining contacts with the first two contacts
    const finalArray = [...shuffledArray.slice(0, 2), ...shuffledRemaining];
    setShuffledContactInfo(finalArray);
  }, [contactInfo]);

  return (
    <div>
      <Typography
        color={'primary'}
        sx={{
          fontWeight: 700,
          fontSize: { xs: 'medium', md: '250%' },
        }}
      >
        {'Let\'s keep in touch'}
      </Typography>
      <Box
        display='grid'
        gridTemplateColumns={{
          xs: 'repeat(1,1fr)',
          md: 'repeat(3, 1fr)',
        }}
        gap={2}
        sx={{ margin: '1vh', marginTop: '4vh', borderRadius: 2 }}
      >
        {shuffledContactInfo.map((ci) => (
          <Box key={ci.name}>
            <img
              alt='Remy Sharp'
              src={ci.image}
              height={'230vh'}
              style={{
                margin: 'auto',
              }}
            />
            <Typography
              color={'primary'}
              sx={{
                fontSize: {
                  xs: 'x-small',
                  md: 'medium',
                  lg: '75%',
                  xl: '120%',
                },
                textDecoration: 'underline',
                fontWeight: 700,
              }}
            >
              {ci.name}
            </Typography>
            <Typography
              color={'primary'}
              sx={{
                fontSize: {
                  xs: 'x-small',
                  md: 'medium',
                  lg: '75%',
                  xl: '95%',
                },
              }}
            >
              {ci.desc}
            </Typography>
            <Box>
              <Button onClick={() => window.open(ci.linkedin, '_blank')}>
                <LinkedInIcon />
              </Button>
              <Button sx={{display: ci.email ? 'inline' : 'none'}}
                onClick={() => {
                  navigator.clipboard.writeText(ci.email);
                  setSnackBarOpen(true);
                }}
              >
                <Snackbar
                  open={snackBarOpen}
                  onClose={() => setSnackBarOpen(false)}
                  message='Copied to clipboard'
                  autoHideDuration={1000}
                  key={'top + center'}
                />
                <EmailIcon />
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </div>
  );
}
