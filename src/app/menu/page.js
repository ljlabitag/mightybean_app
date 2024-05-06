import MenuCategory from "../../components/menu/menu_category"
import SectionHeader from "../../components/general/section_header"

export default function Menu() {
    return(
        <div className="px-8 py-4">
            <div className="py-5 px-8 mb-10">
                <div className="mb-6"><SectionHeader title={'Coffee Selection'}/></div>
                <MenuCategory 
                category="coffee"
                />
            </div>
            <div className="py-5 px-8 mb-10">
                <div className="mb-6"><SectionHeader title={'Milktea Flavors'}/></div>
                <MenuCategory 
                category="milktea"
                />
            </div>
            <div className="py-5 px-8">
                <div className="mb-6"><SectionHeader title={'Lemonade Series'}/></div>
                <MenuCategory 
                category="lemonade"
                />
            </div>
        </div>
    )
};