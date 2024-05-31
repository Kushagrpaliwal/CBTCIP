import Image from "next/image"
import Link from "next/link"

const Hero = () => {
  return (
    <div className="flex flex-row items-center justify-center">
        <div >
            <div className="flex text-center font-bold text-[53px] w-[630px] mt-[45px] ">Conquer Your Day, One Task at a Time</div>
            <p className="flex justify-center font-light "> Streamline your tasks, conquer your goals, and find peace in productivity</p>
            <div className="flex justify-center items-center mt-[40px] mb-[40px]">
            <Link href="/Signup"> <button className='rounded-lg p-2 mr-2 bg-green1 drop-shadow-md hover:drop-shadow-xl text-white w-[120px] h-[50px]'>Get Started</button></Link>
            </div>
            <div className="flex justify-center ">
              <Image src="/hero.svg" alt="heroimg" width={357} height={272} />
            </div>
        </div>
    </div>
  )
}

export default Hero