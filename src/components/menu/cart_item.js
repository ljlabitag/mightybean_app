
export default function CartItem() {
    return(
        <section className="flex justify-around border-2 border-gray-300 rounded-xl">
            <div className="content-center text-center text-sm">Item name</div>
            <div className="content-center text-center text-sm">Item price</div>
            <button className="bg-[#B19470] m-1 text-white text-xs rounded-full px-4 py-1">Remove</button>
        </section>
    )
}