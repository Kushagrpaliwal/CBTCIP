import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className='relative w-full h-[700px] mb-[50px]'>
        <Image src="/footer.svg" alt="footerimg" layout="fill" objectFit="cover"  className="w-full h-full object-contain z-1" />
        <div className='flex flex-col items-center justify-center text-center z-10'>
          <div className=' w-[1100px] text-[80px] font-extrabold mt-[100px] z-10 leading-none mb-10'>Master Your Day With Our TodoList</div>
          <div className='w-[1000px] font-light z-10'>"Organize tasks effortlessly, prioritize effectively, and conquer deadlines with our intuitive todo list for seamless productivity management."</div>
          <Link href="/Signup"><button className='rounded-lg p-2 w-[300px] text-[30px] h-[100px] bg-green1 drop-shadow-md hover:drop-shadow-xl text-white mt-[80px]'>Get Started</button></Link>
        </div>
    </div>
  )
}

export default Footer