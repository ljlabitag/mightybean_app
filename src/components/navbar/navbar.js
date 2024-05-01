import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
    return(
    <nav className='flex flex-row items-center align-middle justify-between w-full h-30 py-4 px-8 border-b-2 shadow-sm'>
        <div className='flex align-middle items-center basis-1/5 justify-start'>
            <Image className='max-w-10 max-h-10 mr-2'
                    src='/MightyBean Logo.svg'
                    key= '1'
                    alt='Logo' 
                    width={100} 
                    height={100}
                    />
            <Link className='align-middle items-center' href={"/"}>MightyBean</Link>
        </div>
        <div className='flex basis-2/5 justify-around'>
            <Link href={"/orders"}>Orders</Link>
            <Link href={"/menu"}>Menu</Link>
            <Link href={"/reports"}>Reports</Link>
            <Link href={"/"}>Login</Link>
        </div>
    </nav>
    )
};