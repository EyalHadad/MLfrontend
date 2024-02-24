import upperImage from '../extensions/images/search-page/research.gif'
import ApiRequests from './../api/ApiRequests'
import FiltersAndTablePage from "../components/FiltersAndTablePage";
import DraggableFab from './../components/DraggableFab';
import SearchHelp from '../components/SearchHelp';
function Search() {
    let title = 'Advanced Search';
    let belowTitle = 'Search for various interactions';
    const accordionDesc = 'Choose interaction filters';

    return (
        <div style={{paddingTop: '15vh'}}>
        <DraggableFab dialogContent={<SearchHelp></SearchHelp>}></DraggableFab>
            <FiltersAndTablePage
                    title={title}
                    belowTitle={belowTitle}
                    accordionDesc={accordionDesc}
                    searchOptionsNeeded={true}
                    filtersApiFunction={async () => {return await ApiRequests.getDetails(true);}}
                    actionApiFunction={async (apiPayload) => {return await ApiRequests.searchInteractions(apiPayload)}}                    
                    upperImage={upperImage}
                    filtersComponent={'SearchFilter'}
                    callingComponent={Search}
            ></FiltersAndTablePage>
        </div>
    )
}
export default Search;