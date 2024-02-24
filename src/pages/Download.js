import upperImage from './../extensions/images/download-page/download.png'
import * as React from 'react';
import Box from '@mui/material/Box';
import DownloadList from '../components/DownloadList';
import { useEffect, useState, useRef, useContext } from 'react';
import ApiRequests from '../api/ApiRequests';
import AlertContext from "../components/AlertContext";
import { Button, IconButton } from '@mui/material';
import GetAll from '@mui/icons-material/AddShoppingCart';
import CommonStrings from '../classes/CommonStrings';
import DNALoading from '../components/DnaLoading';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {Badge} from '@mui/material';
import DownloadDrawer from '../components/DownloadDrawer';
import DraggableFab from './../components/DraggableFab';
import DownloadHelp from '../components/DownloadHelp';
import ReferencesTable from '../components/ReferencesTable';

function Download() {
    const [organisms, setOrganisms] = useState(null);
    const alertContext = useRef(useContext(AlertContext));
    const [downloadSet, setDownloadSet] = useState(new Set());
    const selectAllText = "Select All";
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(()=>{
        async function fetchData(){            
            const result = await ApiRequests.getDetails(false);
            if(!result){
              alertContext.current.set('error', 
              CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
              CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
              <Button onClick={()=>{window.location.reload(); alertContext.current.clear();}}>RELOAD</Button>, 
              10000);            
              return;             
            }
            setOrganisms(result.organisms);
        }
        fetchData();
    }, [])

    const downloadAll = async () => {
        downloadSet.forEach(async datasetId => {
          try {
            await ApiRequests.downloadByDataset(datasetId)
          }
          catch{
            alertContext.current.set('error', 
            CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
            CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
            <Button onClick={()=>{window.location.reload(); alertContext.current.clear();}}>RELOAD</Button>, 
            10000);            
          }
        })
    }

    return (
      <div style={{ paddingTop: '20vh' }}>
        <DraggableFab dialogContent={<DownloadHelp></DownloadHelp>}></DraggableFab>
        <Box
          sx={{
            position: 'relative',
            margin: 'auto',
            width: { xs: '60%', md: '30%' },
          }}
        >
          <img src={upperImage} width={'70%'} height={'70%'} alt='' />
        </Box>
        <Button
        variant='outlined'
        size='large'
        endIcon={<GetAll></GetAll>}
        onClick={() =>
          setDownloadSet(
            new Set(
              organisms.map((o) => o.datasets.map((ds) => ds.id)).flat()
            )
          )
        }
      >
        {selectAllText}
      </Button>
        <IconButton onClick ={() => {setDrawerOpen(true)}}>
          <Badge                 
            color='primary' showZero badgeContent={downloadSet.size}>
            <ShoppingCartIcon color='primary'></ShoppingCartIcon>
          </Badge>
        </IconButton>        
        {!organisms ? (
          <DNALoading></DNALoading>
        ) : (
          <Box>
            {organisms.map((organism) => (
              <DownloadList
                key={organism.name}
                listName={organism.name}
                listItems={organism.datasets.map((dataset) => {
                  return {
                    name: dataset.name,
                    id: dataset.id,
                    weightInMb: dataset.datasetMB,
                    onClick: async () => {
                      try{
                        console.log(dataset.id)

                        alert(dataset.id)
                        await ApiRequests.downloadByDataset(dataset.id)
                      }
                      catch{
                        alertContext.current.set('error', 
                        CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
                        CommonStrings.apiStrings.userExceptions.generalErrorTitle, 
                        <Button onClick={()=>{window.location.reload(); alertContext.current.clear();}}>RELOAD</Button>, 
                        10000);            
                      }
                    },
                  };
                })}
                onCheck={(idToAdd) =>
                  setDownloadSet(
                    (downloadSet) => new Set(downloadSet.add(idToAdd))
                  )
                }
                onUncheck={(idToRemove) =>
                  setDownloadSet(
                    (downloadSet) =>
                      new Set(
                        [...downloadSet].filter((id) => id !== idToRemove)
                      )
                  )
                }
                downloadSet={downloadSet}
              />
            ))}
          </Box>
        )}

      <DownloadDrawer
      setDrawerOpen={setDrawerOpen}
      drawerOpen={drawerOpen}
      downloadSet={downloadSet}
      setDownloadSet={setDownloadSet}
      organisms={organisms}
      downloadAll={downloadAll}
      ></DownloadDrawer>
      <ReferencesTable/>
      </div>
    );
}
export default Download;