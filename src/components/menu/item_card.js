import Image from "next/image";

export default function ItemCard({category, name, price, key}) {
    return(
        <section className="w-60 h-40 bg-[#F8FAE5] border-[#43766C] border-2 shadow rounded-xl">
            <Image className="rounded-full my-2 mx-auto"
            src={`/${category}`}
            key= {key}
            alt={category} 
            width={80} 
            height={80}/>
            <h2 className="font-bold text-center">{name}</h2>
            <h4 className="text-sm font-medium text-center">Price: {price}</h4>
        </section>
    )
}