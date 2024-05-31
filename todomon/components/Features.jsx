import Image from "next/image"

const Features = () => {
  return (
    <div className="flex flex-col items-center justify-center p-[50px] mt-[20px]">
      <div className="flex flex-row">
      <div className="mt-[150px] mr-[40px]">
        <p className="text-green2 text-xs font-bold ">Get It Done</p>
        <div className="font-bold text-[49px] ">Easily Add, Swiftly Delete</div>
        <p className="font-light">Seamlessly manage your tasks with quick add and delete features</p>
      </div>
      <div>
        <Image src="/f1.svg" alt="img" width={431} height={437} />
        </div>
      </div>
      <div className="flex flex-row items-center justify-center mt-[50px] text-right">
         <div><Image src="/f2.svg" alt="img" width={514} height={523} /></div>
         <div className="flex flex-col w-[600px] ml-[50px]">
         <p className="text-green2 text-xs font-bold mb-2">Your Path to Productivity</p>
        <div className="font-bold text-[49px] leading-none">Effortless Organization, Instant Management</div>
        <p className="font-light mt-3 ">Experience seamless task handling with easy sorting, searching, and management. Keep your to-do list clear and productive</p>
         </div>
      </div>
      <div className="flex flex-row mt-[50px]">
      <div className="mt-[100px] mr-[40px] w-[600px]">
        <p className="text-green2 text-xs font-bold mb-2">Plan Smart, Achieve More</p>
        <div className="font-bold text-[49px] leading-none">Time, Priority, Deadlines: Your Tasks, Your Way</div>
        <p className="font-light mt-5">Empower your productivity with customizable task timers, priority levels, deadlines, and intuitive note-making for optimal efficiency.</p>
      </div>
      <div>
        <Image src="/f3.svg" alt="img" width={451} height={451} />
        </div>
        <div class="divide-y divide-blue-200"></div>
      </div>
    </div>
  )
}

export default Features