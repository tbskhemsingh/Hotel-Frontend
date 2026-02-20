import CollectionList from './components/CollectionList';
import RedirectManager from './components/RedirectManager';

export default function CollectionsPage() {
    return (
        <div className="container-fluid py-4">
            <CollectionList />
            {/* <CollectionEditor /> */}
            {/* <RedirectManager /> */}
        </div>
    );
}
