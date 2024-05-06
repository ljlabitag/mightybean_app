
import CartItem from "../../components/menu/cart_item";
import Item from "../../components/item/item";
import SectionHeader from "../../components/general/section_header";

export default function Orders() {

    return(
        <div className="flex flex-row min-h-[580px] px-8 py-2">
            <form className='basis-4/6 pl-10 pr-14 py-4'>
                <Item/>
                <Item/>
            </form>
            <div className='flex basis-2/6'>
                <div className="w-[350px] h-[500px] m-auto border-gray-300 border-2 rounded">
                    <SectionHeader title='Cart'/>
                    <div className="p-4 mb-8">
                        <CartItem/>
                        <h2 className="p-2 text-md font-semibold">Total: </h2>
                    </div>
                    <button className="bg-[#43766C] block mx-auto mb-2 text-white text-2xl rounded-full px-8 py-2">Finalize Order</button>
                </div>
            </div>
        </div>
    )
}