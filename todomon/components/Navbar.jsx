import Image from 'next/image'
import Link from 'next/link'


const Navbar = () => {
  return (
    <nav className='flex flex-row w-full h-[150px] p-[20px]'>
      <div className='flex items-center ml-[30px] '>
        <Image src="/logo.svg" alt="logo" width={250} height={250} />
      </div>
      <div className='flex flex-row list-none gap-8 items-center w-full justify-end'>
         <li className='hover:text-green1 cursor-pointer'>Home</li>
         <li  className='hover:text-green1 cursor-pointer'>About</li>
         <li  className='hover:text-green1 cursor-pointer'>Features</li>
         <Link href="/Login"><li  className='hover:text-green1 cursor-pointer'>Login</li></Link>
        <Link href="/Signup"><button className='rounded-lg p-2 mr-2 bg-green1 drop-shadow-md hover:drop-shadow-xl text-white'>Get Started</button></Link>
      </div>
    </nav>
  )
}

export default Navbar