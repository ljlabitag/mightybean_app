import Image from "next/image";

export default function ItemCard() {
    return(
        <section className="w-40 h-40 bg-[#F8FAE5] border-[#43766C] border-2 shadow rounded-xl">
            <Image className="rounded-full my-2 mx-auto"
            src='/milktea.png'
            key= '3'
            alt='Milktea' 
            width={80} 
            height={80}/>
            <h2 className="font-bold text-center">Item Name</h2>
            <h4 className="text-sm font-medium text-center">Price: </h4>
        </section>
    )
}