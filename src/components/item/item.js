
export default function Item() {
    return(
        <div className="flex flex-row items-center my-4 mr-8 border-2 shadow border-gray-400">
            <div className='basis-2/4 m-1 align-middle'>
                <input id="default-checkbox" type="checkbox" value="" className="ml-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"/>
                <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900">Default checkbox</label>
            </div>
            <div className='basis-1/4'>
                <label htmlFor="quantity" className="ms-2 text-sm font-medium text-gray-900">Quantity:</label>
                <input className='ml-2 border-gray-300 border-2 text-sm font-medium text-gray-900' type="number" id="quantity" name="quantity" min="0" max="5" defaultValue={0}/>   
            </div>
        </div>
    )
};