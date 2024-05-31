import Image from "next/image"
import Link from "next/link"

const Login = () => {
  return (
    <div className="mt-[50px] ml-[150px]">
      <div>
        <Image src="/logo.svg" alt="logo" width={250} height={250} />
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col mt-[50px] ml-[20px] font-bold text-[50px] mb-[100px]">
          <div className="">Login</div>
          <form className="mt-[100px] w-[400px] creds">
            <div className="mb-[20px]">
              <input 
              type="text" 
              id="first_name" 
              class="bg-white drop-shadow-md border border-gray-300 focus:outline-none focus:border-green1 focus:ring focus:ring-green1  text-gray-900 text-sm rounded-lg  w-full h-[72px] p-2.5 " 
              placeholder="Enter Your Email..." 
              required />
            </div>
            <div>
              <input 
                type="text" 
                id="first_name" 
                class="bg-white drop-shadow-md border border-gray-300 focus:outline-none focus:border-green1 focus:ring focus:ring-green1  text-gray-900 text-sm rounded-lg  w-full h-[72px] p-2.5 " 
                placeholder="Enter Your Password..." 
                required />
            </div>
            <Link href="/Maincontent"><button className='mt-[60px] h-[72px] text-[30px] font-medium rounded-lg p-2 w-full bg-green1 drop-shadow-md hover:drop-shadow-xl text-white'>Login</button></Link>
            <div>
            </div>
          </form>
          <div className="text-[14px] font-extralight mt-2">Account Not created? <Link href="/Signup" className="hover:text-green1">Signup</Link></div>
        </div>
        <div className="w-full ">
          <Image src="/login.svg" alt="loginimg" width={500} height={500} className="ml-[100px] mt-[80px]" />
        </div>
      </div>
    </div>
  )
}

export default Login