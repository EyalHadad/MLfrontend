import upperImage from '../extensions/images/browse-page/dna5.gif'
import ApiRequests from './../api/ApiRequests'
import FiltersAndTablePage from "../components/FiltersAndTablePage";
import DraggableFab from './../components/DraggableFab';
import BrowseHelp from '../components/BrowseHelp';

function Browse() {
    let title = 'Interactions Browser';
    let belowTitle = 'Browse interactions data by a dataset name';
    const accordionDesc = 'Select an organism (optional) and a dataset.';
    return (
        <div style={{paddingTop: '15vh'}}>
        <DraggableFab dialogContent={<BrowseHelp></BrowseHelp>}></DraggableFab>
            <FiltersAndTablePage
                    title={title}
                    belowTitle={belowTitle}
                    accordionDesc={accordionDesc}
                    searchOptionsNeeded={false}
                    filtersApiFunction={async () => {return await ApiRequests.getDetails(false);}}
                    actionApiFunction={async (apiPayload) => {return await ApiRequests.browseInteractions(apiPayload);}}                    
                    upperImage={upperImage}
                    filtersComponent={'BrowseFilter'}
                    callingComponent={Browse}
            ></FiltersAndTablePage>
        </div>
    )
}
export default Browse;